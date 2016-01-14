# coding: utf-8
# pylint: disable=missing-docstring, invalid-name
import flask

import auth
import model
import config
from main import app


instagram_config = dict(
    access_token_method='POST',
    access_token_url='https://api.instagram.com/oauth/access_token',
    authorize_url='https://instagram.com/oauth/authorize/',
    base_url='https://api.instagram.com/v1',
    consumer_key=config.CONFIG_DB.auth_instagram_id,
    consumer_secret=config.CONFIG_DB.auth_instagram_secret,
)

instagram = auth.create_oauth_app(instagram_config, 'instagram')


@app.route('/_s/callback/instagram/oauth-authorized/')
def instagram_authorized():
    response = instagram.authorized_response()
    if response is None:
        flask.flash('You denied the request to sign in.')
        return flask.redirect(flask.url_for('index'))

    flask.session['oauth_token'] = (response['access_token'], '')
    user_db = retrieve_user_from_instagram(response['user'])
    return auth.signin_via_social(user_db)


@instagram.tokengetter
def get_instagram_oauth_token():
    return flask.session.get('oauth_token')


@app.route('/signin/instagram/')
def signin_instagram():
    return auth.signin_oauth(instagram)


def retrieve_user_from_instagram(response):
    auth_id = 'instagram_%s' % response['id']
    user_db = model.User.get_by('auth_ids', auth_id)
    if user_db:
        return user_db

    return auth.create_or_get_user_db(
        auth_id=auth_id,
        name=response.get('full_name', '').strip() or response.get('username'),
        username=response.get('username'),
        verified=True
    )
