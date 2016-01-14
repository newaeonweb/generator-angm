# coding: utf-8
# pylint: disable=missing-docstring, invalid-name
import flask

import auth
import config
import model

from main import app


microsoft_config = dict(
    access_token_method='POST',
    access_token_url='https://login.live.com/oauth20_token.srf',
    authorize_url='https://login.live.com/oauth20_authorize.srf',
    base_url='https://apis.live.net/v5.0/',
    consumer_key=config.CONFIG_DB.auth_microsoft_id,
    consumer_secret=config.CONFIG_DB.auth_microsoft_secret,
    request_token_params={'scope': 'wl.emails'},
)

microsoft = auth.create_oauth_app(microsoft_config, 'microsoft')


@app.route('/_s/callback/microsoft/oauth-authorized/')
def microsoft_authorized():
    response = microsoft.authorized_response()
    if response is None:
        flask.flash('You denied the request to sign in.')
        return flask.redirect(flask.url_for('index'))
    flask.session['oauth_token'] = (response['access_token'], '')
    me = microsoft.get('me')
    if me.data.get('error', {}):
        return 'Unknown error: error:%s error_description:%s' % (
            me['error']['code'],
            me['error']['message'],
        )
    user_db = retrieve_user_from_microsoft(me.data)
    return auth.signin_via_social(user_db)


@microsoft.tokengetter
def get_microsoft_oauth_token():
    return flask.session.get('oauth_token')


@app.route('/signin/microsoft/')
def signin_microsoft():
    return auth.signin_oauth(microsoft)


def retrieve_user_from_microsoft(response):
    auth_id = 'microsoft_%s' % response['id']
    user_db = model.User.get_by('auth_ids', auth_id)
    if user_db:
        return user_db
    email = response['emails']['preferred'] or response['emails']['account']
    return auth.create_or_get_user_db(
        auth_id=auth_id,
        name=response.get('name', ''),
        username=email,
        email=email,
        verified=True,
    )
