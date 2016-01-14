"""
Provides decorator functions for api methods, which are used as middleware for processing requests
"""

import functools
from google.appengine.ext import ndb #pylint: disable=import-error
from flask import g, abort
from helpers import make_not_found_exception, ArgumentValidator
from main import config, auth
from flask_restful import reqparse, inputs
import model


def model_by_key(func):
    """Gets model by ndb.Key, which is passed in URL
        Note we don't need to know specific collection in which key belongs.
        ndb.Key has in itself encoded ID of entry as well as collection name,
        in which it belongs to

        Raises:
              HTTPException: If key was not found in data store

        """

    @functools.wraps(func)
    def decorated_function(*args, **kwargs): # pylint: disable=missing-docstring
        g.model_key = ndb.Key(urlsafe=kwargs['key'])
        g.model_db = g.model_key.get()
        if g.model_db:
            return func(*args, **kwargs)
        return make_not_found_exception()

    return decorated_function


def verify_captcha(form_name):
    """This decorator verifies validity of captcha. Passed form_name is here for
     determining if captcha verifying is enabled/disabled in CONFIG_DB for given form name.
     E.g we can turn off specific form with captcha in Admin and decorator won't
     throw any errors even without passed captcha.
     Being able to easily turn off/on captchas on specific forms is especialy
     useful while developing.

    Args:
        form_name (string): Form name, which is saved in CONFIG_DB.recaptcha_forms
            if captcha for this form is enabled

    Raises:
          ValueError: If captcha is invalid.

    """

    def decorator(func):  # pylint: disable=missing-docstring
        @functools.wraps(func)
        def decorated_function(*args, **kwargs):  # pylint: disable=missing-docstring
            if form_name in config.CONFIG_DB.recaptcha_forms:
                parser = reqparse.RequestParser()
                parser.add_argument('captcha', type=ArgumentValidator.create('captcha'), required=True)
                parser.parse_args()
            return func(*args, **kwargs)

        return decorated_function

    return decorator


def user_by_username(func):
    """Gets User model by username in URL and assigns it into g.user_db"""
    @functools.wraps(func)
    def decorated_function(*args, **kwargs): # pylint: disable=missing-docstring
        g.user_db = model.User.get_by('username', kwargs['username'])
        if g.user_db:
            return func(*args, **kwargs)
        return make_not_found_exception()

    return decorated_function


def login_required(func):
    """Returns 401 error if user is not logged in while requesting certain API URL"""
    @functools.wraps(func)
    def decorated_function(*args, **kwargs): # pylint: disable=missing-docstring
        if auth.is_logged_in():
            return func(*args, **kwargs)
        return abort(401)

    return decorated_function


def admin_required(func):
    """Returns 401 response if user is not logged in while requesting certain API URL
    or returns 403 response if user is not admin in while requesting certain API URL
    """
    @functools.wraps(func)
    def decorated_function(*args, **kwargs): # pylint: disable=missing-docstring
        if auth.is_admin():
            return func(*args, **kwargs)
        if not auth.is_logged_in():
            return abort(401)
        return abort(403)

    return decorated_function


def authorization_required(func):
    """Returns 401 response if user is not logged in while requesting URL with user
    ndb.Key in it
    Returns 403 response if logged in user's ndb.Key is different from ndb.Key given in
    requested URL.
    """
    @functools.wraps(func)
    def decorated_function(*args, **kwargs): # pylint: disable=missing-docstring
        if auth.is_authorized(ndb.Key(urlsafe=kwargs['key'])):
            return func(*args, **kwargs)
        if not auth.is_logged_in():
            return abort(401)
        return abort(403)

    return decorated_function


def parse_signin(func):
    """Parses credentials posted by client and loads appropriate user from datastore"""
    @functools.wraps(func)
    def decorated_function(*args, **kwargs): # pylint: disable=missing-docstring
        parser = reqparse.RequestParser()
        parser.add_argument('login', type=str, required=True)
        parser.add_argument('password', type=model.UserValidator.create('password'), required=True)
        parser.add_argument('remember', type=inputs.boolean, default=False)
        g.args = parser.parse_args()
        g.user_db = model.User.get_by_credentials(g.args.login, g.args.password)
        return func(*args, **kwargs)

    return decorated_function
