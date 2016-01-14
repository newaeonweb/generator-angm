# coding: utf-8
"""
Set of helper function used throughout the REST API
"""
from google.appengine.datastore.datastore_query import Cursor #pylint: disable=import-error
from google.appengine.api import urlfetch #pylint: disable=import-error
import logging

import flask_restful as restful
from werkzeug import exceptions
import flask
import model
from main import config
import urllib
from flask import request
import json


class Api(restful.Api): # pylint: disable=too-few-public-methods
    """By extending restful.Api class we can make custom implementation of some of its methods"""

    def handle_error(self, err):
        """Specifies error handler for REST API.
        It is called when exception is raised during request processing

        Args:
            err (Exception): the raised Exception object

        """
        return handle_error(err)


def handle_error(err):
    """This error handler logs exception and then makes response with most
    appropriate error message and error code

    Args:
        err (Exception): the raised Exception object

    """
    logging.exception(err)
    message = ''
    if hasattr(err, 'data') and err.data['message']:
        message = err.data['message']
    elif hasattr(err, 'message') and err.message:
        message = err.message
    elif hasattr(err, 'description'):
        message = err.description
    try:
        err.code
    except AttributeError:
        err.code = 500
    return flask.jsonify({
        'message': message
    }), err.code


def make_not_found_exception():
    """Raises 404 Not Found exception

    Raises:
        HTTPException: with 404 code
    """
    raise exceptions.NotFound()


def make_bad_request_exception(message):
    """Raises 400 Bad request exception

    Raises:
        HTTPException: with 400 code
    """
    raise exceptions.BadRequest(message)


def make_empty_ok_response():
    """Returns OK response with empty body"""
    return '', 204


def make_list_response(reponse_list, cursor=None, more=False, total_count=None):
    """Creates reponse with list of items and also meta data useful for pagination

    Args:
        reponse_list (list): list of items to be in response
        cursor (Cursor, optional): ndb query cursor
        more (bool, optional): whether there's more items in terms of pagination
        total_count (int, optional): Total number of items

    Returns:
        dict: response to be serialized and sent to client
    """
    return {
        'list': reponse_list,
        'meta': {
            'nextCursor': cursor.urlsafe(),
            'more': more,
            'totalCount': total_count
        }
    }


class ArgumentValidator(model.BaseValidator):
    """This validator class contains attributes and methods for validating user's input,
    which is not associated with any particular datastore model, but still needs
    to be validated

    Attributes:
      feedback (list): determining min and max lengths of feedback message sent to admin

    """
    feedback = [1, 2000]

    @classmethod
    def captcha(cls, captcha):
        """Verifies captcha by sending it to google servers

        Args:
            captcha (string): captcha string received from client.

        Returns:
            bool: True if successful

        Raises:
           ValueError: If captcha is incorrect
        """
        if not config.CONFIG_DB.has_recaptcha:
            return True

        params = {
            'secret': config.CONFIG_DB.recaptcha_private_key,
            'remoteip': request.remote_addr,
            'response': captcha
        }
        params = urllib.urlencode(params)
        result = urlfetch.fetch(url='https://www.google.com/recaptcha/api/siteverify',
                                payload=params,
                                method=urlfetch.POST,
                                headers={'Content-Type': 'application/x-www-form-urlencoded'})
        success = json.loads(result.content)['success']
        if not success:
            raise ValueError('Sorry, incorrect captcha')
        return True

    @classmethod
    def cursor(cls, cursor):
        """Verifies if given string is valid ndb query cursor
        if so returns instance of it

        Args:
            cursor (string): Url encoded ndb query cursor

        Returns:
            google.appengine.datastore.datastore_query.Cursor: ndb query cursor

        Raises:
           ValueError: If captcha is incorrect
        """
        if not cursor:
            return None
        return Cursor(urlsafe=cursor)



