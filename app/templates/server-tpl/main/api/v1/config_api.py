# coding: utf-8
# pylint: disable=too-few-public-methods, no-self-use, missing-docstring, unused-argument
from flask_restful import Resource

from main import API
from flask import request
from config import CONFIG_DB
from model import Config
import util
from api.helpers import make_empty_ok_response
from api.decorators import admin_required

@API.resource('/api/v1/config')
class AdminConfigAPI(Resource):
    @admin_required
    def get(self):
        return CONFIG_DB.to_dict(include=Config.get_all_properties())

    @admin_required
    def put(self):
        request.json['recaptcha_forms'] = util.dict_to_list(request.json['recaptcha_forms'])
        CONFIG_DB.populate(**request.json)
        CONFIG_DB.put()
        return make_empty_ok_response()
