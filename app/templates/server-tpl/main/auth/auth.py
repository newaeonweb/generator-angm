# coding: utf-8
# pylint: disable=no-self-use
"""
Provides logic for authenticating users
"""
from __future__ import absolute_import
import re
import flask_login as login
from flask_oauthlib import client as oauth
from google.appengine.ext import ndb  # pylint: disable=import-error
import flask
import unidecode
from flask_restful import reqparse, inputs
import model
import task
import util


from main import app, config

login_manager = login.LoginManager()  # pylint: disable=invalid-name


class AnonymousUser(login.AnonymousUserMixin):  # pylint: disable=no-init, too-few-public-methods
    """By default, when a user is not actually logged in, current_user is set to
    an AnonymousUserMixin object. It has the following properties and methods:

        is_active and is_authenticated are False
        is_anonymous is True
        get_id() returns None
    """
    user_db = None


login_manager.anonymous_user = AnonymousUser


class FlaskUser(AnonymousUser):
    """This provides implementations for the methods that Flask-Login
    expects user objects to have.

    Flask-Login expects to have these methods:
        get_id
        is_authenticated
        is_active
        is_anonymous
    """

    def __init__(self, user_db):
        """Assigns user_db to Flask user"""
        self.user_db = user_db

    def get_id(self):
        """Returns a unicode that uniquely identifies this user, and can be used to load
         the user from the user_loader callback."""
        return self.user_db.key.urlsafe()

    def is_authenticated(self):
        """Returns True if the user is authenticated, i.e. they have provided valid credentials"""
        return True

    def is_active(self):
        """Returns True if this is an active user - in addition to being authenticated,
        they also have activated their account, not been suspended"""
        return self.user_db.active

    def is_anonymous(self):
        """Returns True if this is an anonymous user. """
        return False


@login_manager.user_loader
def load_user(key):
    """This callback is used to reload the user object from the user ID stored in the session.

    Args:
        ndb.Key: Url safe format of ndb.Key of user

    Returns:
        FlaskUser: if found, returns loaded user as FlaskUser, otherwise None
    """
    user_db = ndb.Key(urlsafe=key).get()
    if user_db:
        return FlaskUser(user_db)
    return None


login_manager.init_app(app)


def current_user_key():
    """Convenient method to get ndb.Key of currently logged user"""
    return login.current_user.user_db.key if login.current_user.user_db else None


def current_user_db():
    """Convenient method to get ndb.Model instance of currently logged user"""
    return login.current_user.user_db


def is_logged_in():
    """Convenient method if user is logged in"""
    return bool(login.current_user.user_db)


def is_admin():
    """Convenient method if currently logged user is admin"""
    return is_logged_in() and login.current_user.user_db.admin


def is_authorized(user_key):
    """Convenient method for finding out if curretly logged user has given user_key
    or is admin"""
    return current_user_key() == user_key or is_admin()


def create_oauth_app(service_config, name):
    """Creates oauth app for particaular web service

    Args:
        service_config (dict): config required for creating oauth app
        name (string): name of the service, e.g github
    """
    upper_name = name.upper()
    app.config[upper_name] = service_config
    service_oauth = oauth.OAuth()
    service_app = service_oauth.remote_app(name, app_key=upper_name)
    service_oauth.init_app(app)
    return service_app


def save_request_params():
    """Function temporily saves 'remember' url parameter into users session.
    This is useful when we login via oauth, so redirects would wipe out our url parameters."""
    parser = reqparse.RequestParser()
    parser.add_argument('remember', type=inputs.boolean, default=False)
    args = parser.parse_args()
    flask.session['auth-params'] = {
        'remember': args.remember,
    }


def signin_oauth(oauth_app, scheme=None):
    """Attemps to sign in via given oauth_app. If successfull it will redirect to
    appropriate url. E.g. if signing via github it will call github_authorized
    as callback function

    Args:
        oauth_app (OAuth): Flask Oauth app
        scheme (string): http or https to use in callback url
    """
    if scheme is None:
        scheme = 'https' if config.PRODUCTION else 'http'
    try:
        flask.session.pop('oauth_token', None)
        save_request_params()
        return oauth_app.authorize(callback=flask.url_for(
            '%s_authorized' % oauth_app.name, _external=True, _scheme=scheme
        ))
    except oauth.OAuthException:
        flask.flash('Something went wrong with sign in. Please try again.')
        return flask.redirect(flask.url_for('index'))


def create_user_db(auth_id, name, username, email='', verified=False, password='', **props):
    """Saves new user into datastore"""
    if password:
        password = util.password_hash(password)

    email = email.lower()
    user_db = model.User(
        name=name,
        email=email,
        username=username,
        auth_ids=[auth_id] if auth_id else [],
        verified=verified,
        token=util.uuid(),
        password_hash=password,
        **props
    )
    user_db.put()
    task.new_user_notification(user_db)
    return user_db


def create_or_get_user_db(auth_id, name, username, email='', **kwargs):
    """This function will first lookup if user with given email already exists.
    If yes then it will append auth_id for his record and saves it.
    If not we'll make sure to find unique username for this user (for the case of signing up via social account)
    and then store it into datastore"""
    user_db = model.User.get_by('email', email.lower())
    if user_db:
        user_db.auth_ids.append(auth_id)
        user_db.put()
        return user_db

    if isinstance(username, str):
        username = username.decode('utf-8')
    username = unidecode.unidecode(username.split('@')[0].lower()).strip()
    username = re.sub(r'[\W_]+', '.', username)
    new_username = username
    suffix = 1
    while not model.User.is_username_available(new_username):
        new_username = '%s%d' % (username, suffix)
        suffix += 1

    return create_user_db(auth_id, name, new_username, email=email, **kwargs)


def signin_user_db(user_db, remember=False):
    """Signs in given user"""
    flask_user_db = FlaskUser(user_db)
    auth_params = flask.session.get('auth-params', {
        'remember': remember,
    })
    flask.session.pop('auth-params', None)
    return login.login_user(flask_user_db, remember=auth_params['remember'])


def signout_user():
    """Signs out given user"""
    login.logout_user()


def signin_via_social(*args, **kwargs):
    """Signs in given, when he used social account and then it redirects him to home page"""
    if not signin_user_db(*args, **kwargs):
        flask.flash('Sorry, there was an error while signing you in')
    return flask.redirect(flask.url_for('index'))
