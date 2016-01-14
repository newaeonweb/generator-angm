# coding: utf-8
# pylint: disable=too-few-public-methods, no-self-use, missing-docstring, unused-argument
"""
Provides API logic relevant to users
"""
from flask_restful import reqparse, Resource

import auth
import util

from main import API
from model import User, UserValidator
from api.helpers import ArgumentValidator, make_list_response, make_empty_ok_response
from flask import request, g
from pydash import _
from api.decorators import model_by_key, user_by_username, authorization_required, admin_required


@API.resource('/api/v1/users')
class UsersAPI(Resource):
    """Gets list of users. Uses ndb Cursor for pagination. Obtaining users is executed
    in parallel with obtaining total count via *_async functions
    """
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('cursor', type=ArgumentValidator.create('cursor'))
        args = parser.parse_args()

        users_future = User.query() \
            .order(-User.created) \
            .fetch_page_async(10, start_cursor=args.cursor)

        total_count_future = User.query().count_async(keys_only=True)
        users, next_cursor, more = users_future.get_result()
        users = [u.to_dict(include=User.get_public_properties()) for u in users]
        return make_list_response(users, next_cursor, more, total_count_future.get_result())


@API.resource('/api/v1/users/<string:username>')
class UserByUsernameAPI(Resource):
    @user_by_username
    def get(self, username):
        """Loads user's properties. If logged user is admin it loads also non public properties"""
        if auth.is_admin():
            properties = User.get_private_properties()
        else:
            properties = User.get_public_properties()
        return g.user_db.to_dict(include=properties)


@API.resource('/api/v1/users/<string:key>')
class UserByKeyAPI(Resource):
    @authorization_required
    @model_by_key
    def put(self, key):
        """Updates user's properties"""
        update_properties = ['name', 'bio', 'email', 'location', 'facebook', 'github',
                             'gplus', 'linkedin', 'twitter', 'instagram']
        if auth.is_admin():
            update_properties += ['verified', 'active', 'admin']

        new_data = _.pick(request.json, update_properties)
        g.model_db.populate(**new_data)
        g.model_db.put()
        return make_empty_ok_response()

    @admin_required
    @model_by_key
    def delete(self, key):
        """Deletes user"""
        g.model_key.delete()
        return make_empty_ok_response()


@API.resource('/api/v1/users/<string:key>/password')
class UserPasswordAPI(Resource):
    @authorization_required
    @model_by_key
    def post(self, key):
        """Changes user's password"""
        parser = reqparse.RequestParser()
        parser.add_argument('currentPassword', type=UserValidator.create('password', required=False), dest='current_password')
        parser.add_argument('newPassword', type=UserValidator.create('password'), dest='new_password')
        args = parser.parse_args()
        # Users, who signed up via social networks have empty password_hash, so they have to be allowed
        # to change it as well
        if g.model_db.password_hash != '' and not g.model_db.has_password(args.current_password):
            raise ValueError('Given password is incorrect.')
        g.model_db.password_hash = util.password_hash(args.new_password)
        g.model_db.put()
        return make_empty_ok_response()


