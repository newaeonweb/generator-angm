# coding: utf-8
# pylint: disable=missing-docstring, invalid-name

import flask

import auth
import config
import model
from main import app


bitbucket_config = dict(
    access_token_url='https://bitbucket.org/api/1.0/oauth/access_token',
    authorize_url='https://bitbucket.org/api/1.0/oauth/authenticate',
    base_url='https://api.bitbucket.org/1.0/',
    consumer_key=config.CONFIG_DB.auth_bitbucket_id,
    consumer_secret=config.CONFIG_DB.auth_bitbucket_secret,
    request_token_url='https://bitbucket.org/api/1.0/oauth/request_token',
)

bitbucket = auth.create_oauth_app(bitbucket_config, 'bitbucket')


@app.route('/_s/callback/bitbucket/oauth-authorized/')
def bitbucket_authorized():
    response = bitbucket.authorized_response()
    if response is None:
        flask.flash('You denied the request to sign in.')
        return flask.redirect(flask.url_for('index'))

    flask.session['oauth_token'] = (
        response['oauth_token'],
        response['oauth_token_secret'],
    )
    me = bitbucket.get('user')
    user_db = retrieve_user_from_bitbucket(me.data['user'])
    return auth.signin_via_social(user_db)


@bitbucket.tokengetter
def get_bitbucket_oauth_token():
    return flask.session.get('oauth_token')


@app.route('/signin/bitbucket/')
def signin_bitbucket():
    return auth.signin_oauth(bitbucket)


def retrieve_user_from_bitbucket(response):
    auth_id = 'bitbucket_%s' % response['username']
    user_db = model.User.get_by('auth_ids', auth_id)
    if user_db:
        return user_db
    if response['first_name'] or response['last_name']:
        name = ' '.join((response['first_name'], response['last_name'])).strip()
    else:
        name = ''
    emails = bitbucket.get('users/%s/emails' % response['username'])
    email = ''.join([e['email'] for e in emails.data if e['primary']][0:1])
    return auth.create_or_get_user_db(
        auth_id=auth_id,
        name=name,
        username=response['username'],
        email=email,
        verified=True,
    )
