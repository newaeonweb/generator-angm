# coding: utf-8
# pylint: disable=too-few-public-methods, no-self-use, missing-docstring, unused-argument
from flask_restful import Resource
from main import API
from flask import abort
from config import DEVELOPMENT
from model.factories import UserFactory
from google.appengine.ext import ndb #pylint: disable=import-error
from api.helpers import make_empty_ok_response

@API.resource('/api/v1/generate_database')
class GenerateDatabaseAPI(Resource):
    @ndb.toplevel
    def post(self):
        """Generates mock data for development purposes"""
        if not DEVELOPMENT:
            abort(404)
        UserFactory.create_batch(50)
        return make_empty_ok_response()
