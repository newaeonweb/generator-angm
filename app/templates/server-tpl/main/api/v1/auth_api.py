# coding: utf-8
# pylint: disable=too-few-public-methods, no-self-use, missing-docstring, unused-argument
"""
Provides API logic relevant to user authentication
"""
from flask_restful import reqparse, inputs, Resource
from flask import g
import util
import auth
import config
from model import User, UserValidator, Config
import task
from main import API
from api.helpers import make_bad_request_exception, make_empty_ok_response
from api.decorators import verify_captcha, parse_signin
from google.appengine.ext import ndb  # pylint: disable=import-error


@API.resource('/api/v1/auth/signup')
class SignupAPI(Resource):
    @verify_captcha('signupForm')
    def post(self):
        """Creates new user account if provided valid arguments"""
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=UserValidator.create('unique_email'), required=True)
        parser.add_argument('username', type=UserValidator.create('unique_username'))
        parser.add_argument('password', type=UserValidator.create('password'))
        parser.add_argument('remember', type=inputs.boolean, default=False)
        args = parser.parse_args()

        user_db = auth.create_user_db(
            auth_id=None,
            name='',
            username=args.username,
            email=args.email,
            verified=True if not config.CONFIG_DB.verify_email else False,
            password=args.password
        )
        user_db.put()

        if config.CONFIG_DB.verify_email:
            task.verify_user_email_notification(user_db)
            return make_empty_ok_response()

        # if users don't need to verify email, we automaticaly signin newly registered user
        auth.signin_user_db(user_db, remember=args.remember)
        return user_db.to_dict(include=User.get_private_properties())


@API.resource('/api/v1/auth/signin')
class SigninAPI(Resource):
    @verify_captcha('signinForm')
    @parse_signin
    def post(self):
        """Signs in existing user. Note, g.user_db is set inside parse_signin decorator"""
        if g.user_db and g.user_db.verified and g.user_db.active:
            auth.signin_user_db(g.user_db, remember=g.args.remember)

        if g.user_db is None:
            make_bad_request_exception('Seems like these credentials are invalid')

        return g.user_db.to_dict(include=User.get_private_properties())


@API.resource('/api/v1/auth/signout')
class SignoutAPI(Resource):
    def post(self):
        """Signs out user. Also it sends back config object with public properties,
        in case signed out user was admin, we want override his config object
        with new one, since admin config contains even private properties"""
        auth.signout_user()
        app_config = config.CONFIG_DB.to_dict(include=Config.get_public_properties())
        app_config['development'] = config.DEVELOPMENT
        return app_config


@API.resource('/api/v1/auth/resend-verification')
class ResendActivationAPI(Resource):
    @parse_signin
    def post(self):
        """Resends email verification to user"""
        if g.user_db and not g.user_db.verified and g.user_db.active:
            task.verify_user_email_notification(g.user_db)
        return make_empty_ok_response()


@API.resource('/api/v1/auth/forgot')
class ForgotPasswordAPI(Resource):
    def post(self):
        """Sends email with token for resetting password to an user"""
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=UserValidator.create('existing_email'))
        args = parser.parse_args()
        user_db = User.get_by('email', args.email)
        task.reset_password_notification(user_db)
        return make_empty_ok_response()


@API.resource('/api/v1/auth/reset')
class ResetPasswordAPI(Resource):
    @ndb.toplevel
    def post(self):
        """Sets new password given by user if he provided valid token
        Notice ndb.toplevel decorator here, so we can perform asynchronous put
         and signing in in parallel
        """
        parser = reqparse.RequestParser()
        parser.add_argument('token', type=UserValidator.create('token'))
        parser.add_argument('newPassword', type=UserValidator.create('password'), dest='new_password')
        args = parser.parse_args()
        user_db = User.get_by('token', args.token)
        user_db.password_hash = util.password_hash(args.new_password)
        user_db.token = util.uuid()
        user_db.verified = True
        user_db.put_async()
        auth.signin_user_db(user_db)
        return user_db.to_dict(include=User.get_private_properties())
