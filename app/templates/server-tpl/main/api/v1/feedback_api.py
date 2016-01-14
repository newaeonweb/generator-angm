# coding: utf-8
# pylint: disable=too-few-public-methods, no-self-use, missing-docstring, unused-argument
from flask_restful import reqparse, Resource
from flask import abort
from main import API
import task
import config
from api.helpers import ArgumentValidator, make_empty_ok_response
from api.decorators import verify_captcha
from model import UserValidator


@API.resource('/api/v1/feedback')
class FeedbackAPI(Resource):
    @verify_captcha('feedbackForm')
    def post(self):
        """Sends feedback email to admin"""
        if not config.CONFIG_DB.feedback_email:
            return abort(418)
        parser = reqparse.RequestParser()
        parser.add_argument('message', type=ArgumentValidator.create('feedback'), required=True)
        parser.add_argument('email', type=UserValidator.create('email', required=False))
        args = parser.parse_args()
        body = '%s\n\n%s' % (args.message, args.email)
        kwargs = {'reply_to': args.email} if args.email else {}
        task.send_mail_notification('%s...' % body[:48].strip(), body, **kwargs)
        return make_empty_ok_response()
