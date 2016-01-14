# coding: utf-8
"""
Module for created app engine deferred tasks. Mostly sending emails
"""
import logging

import flask
from google.appengine.api import mail #pylint: disable=import-error
from google.appengine.ext import deferred #pylint: disable=import-error

import config
import util


def send_mail_notification(subject, body, receiver=None, **kwargs):
    """Function for sending email via GAE's mail and deferred module

    Args:
          subject (string): Email subject
          body (string): Email body
          receiver (string, optional): Email receiver, if omitted admin will send email himself
          **kwargs: Arbitrary keyword arguments.
    """
    if not config.CONFIG_DB.feedback_email:
        return
    brand_name = config.CONFIG_DB.brand_name
    sender = '%s <%s>' % (brand_name, config.CONFIG_DB.feedback_email)
    subject = '[%s] %s' % (brand_name, subject)
    if config.DEVELOPMENT:
        logging.info(
            '\n'
            '######### Deferring to send this email: #############################'
            '\nFrom: %s\nTo: %s\nSubject: %s\n\n%s\n'
            '#####################################################################'
            , sender, receiver or sender, subject, body)
    deferred.defer(mail.send_mail, sender, receiver or sender, subject, body, **kwargs)


def new_user_notification(user_db):
    """Sends notification to admin about newly registered user
    To be this enabled, notify_on_new_user must be true in config database

    Args:
          user_db (model.User): newly registered user
    """
    if not config.CONFIG_DB.notify_on_new_user:
        return
    body = 'name: %s\nusername: %s\nemail: %s\n%s\n%s' % (
        user_db.name,
        user_db.username,
        user_db.email,
        ''.join([': '.join(('%s\n' % a).split('_')) for a in user_db.auth_ids]),
        '%s#!/user/%s' % (flask.url_for('index', _external=True), user_db.username)
    )
    send_mail_notification('New user: %s' % user_db.name, body)


def reset_password_notification(user_db):
    """Sends email with url, which user can use to reset his password

    Args:
          user_db (model.User): User, who requested password reset
    """
    if not user_db.email:
        return
    user_db.token = util.uuid()
    user_db.put()

    receiver = '%s <%s>' % (user_db.name, user_db.email)
    body = '''Hello %(name)s,

it seems someone (hopefully you) tried to reset your password with %(brand)s.

In case it was you, please reset it by following this link:

%(link)s

If it wasn't you, we apologize. You can either ignore this email or reply to it
so we can take a look.

Best regards,
%(brand)s
''' % {
    'name': user_db.name,
    'link': flask.url_for('user_reset', token=user_db.token, _external=True),
    'brand': config.CONFIG_DB.brand_name,
}

    send_mail_notification('Reset your password', body, receiver)


def verify_user_email_notification(user_db):
    """Sends email, which user can use to verify his email address

    Args:
          user_db (model.User): user, who should verify his email
    """
    if not user_db.email:
        return
    user_db.token = util.uuid()
    user_db.put()

    receiver = user_db.email
    body = '''Welcome to %(brand)s.

Follow the link below to confirm your email address and activate your account:

%(link)s

If it wasn't you, we apologize. You can either ignore this email or reply to it
so we can take a look.

Best regards,
%(brand)s
''' % {
    'link': flask.url_for('user_verify', token=user_db.token, _external=True),
    'brand': config.CONFIG_DB.brand_name,
}

    send_mail_notification('Verify your email', body, receiver)
