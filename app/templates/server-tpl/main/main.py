# coding: utf-8
"""
Initializes flask server and assigns all routes by importing modules
"""
import flask

import config

app = flask.Flask(__name__) # pylint: disable=invalid-name
# note, while developing Flask server doesn't need to run with DEBUG parameter, since server restarting
# is taken care by GAE SDK
app.config.from_object(config)
app.jinja_env.line_statement_prefix = '#'
app.jinja_env.line_comment_prefix = '##'

import auth # pylint: disable=unused-import
import control # pylint: disable=unused-import
import model # pylint: disable=unused-import
import task # pylint: disable=unused-import

from api import helpers

API = helpers.Api(app)

import api.v1 # pylint: disable=unused-import
