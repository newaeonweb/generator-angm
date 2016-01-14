# coding: utf-8
"""Provides implementation of Config"""
from __future__ import absolute_import

from google.appengine.ext import ndb

import config
from model import Base, ConfigAuth
import util
from pydash import _


class Config(Base, ConfigAuth):
    """A class describing datastore config."""
    analytics_id = ndb.StringProperty(default='')  # Google Analytics ID
    brand_name = ndb.StringProperty(default=config.APPLICATION_ID)  # Webapp name
    description = ndb.StringProperty(default='')  # Webapp description
    feedback_email = ndb.StringProperty(default='')  # Admin's email, where feedback will be sent
    flask_secret_key = ndb.StringProperty(default=util.uuid())
    notify_on_new_user = ndb.BooleanProperty(default=True)  # Whether to send email to admin if user signs up
    recaptcha_forms = ndb.StringProperty(repeated=True)  # List of form names where recaptcha is enabled
    recaptcha_private_key = ndb.StringProperty(default='')
    recaptcha_public_key = ndb.StringProperty(default='')
    salt = ndb.StringProperty(default=util.uuid())
    verify_email = ndb.BooleanProperty(default=True)  # Whether to verify emails of newly registered users

    PUBLIC_PROPERTIES = ConfigAuth.get_public_properties() + \
                        ['analytics_id', 'brand_name', 'description', 'recaptcha_public_key',
                         'has_recaptcha', 'has_feedback_form', 'recaptcha_forms', 'verify_email']

    @property
    def has_feedback_form(self):
        """If feedback form should be displayed"""
        return bool(self.feedback_email)

    @property
    def has_recaptcha(self):  # pylint: disable=missing-docstring
        return bool(self.recaptcha_private_key and self.recaptcha_public_key)

    @classmethod
    def get_master_db(cls):
        """Get config entity doesn't exist, it creates new one.
        There's need only for one config - master"""
        return cls.get_or_insert('master')


    def to_dict(self, *args, **kwargs):
        """Creates dict representaion of config, recaptcha_forms are converted so angular models can
        easily use it"""
        repr_dict = super(Config, self).to_dict(*args, **kwargs)
        repr_dict['recaptcha_forms'] = util.list_to_dict(repr_dict['recaptcha_forms'])
        return repr_dict

    @classmethod
    def get_all_properties(cls):
        """Excludes few properties, before sending to client"""
        all_properties = super(Config, cls).get_all_properties()
        all_properties += cls.PUBLIC_PROPERTIES
        return _.pull(_.uniq(all_properties), 'version', 'modified', 'created', 'key', 'id')
