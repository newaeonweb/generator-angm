# coding: utf-8
# pylint: disable=missing-docstring, invalid-name
import flask

import auth
import config
import model

from main import app


twitter_config = dict(
    access_token_url='https://api.twitter.com/oauth/access_token',
    authorize_url='https://api.twitter.com/oauth/authorize',
    base_url='https://api.twitter.com/1.1/',
    consumer_key=config.CONFIG_DB.auth_twitter_id,
    consumer_secret=config.CONFIG_DB.auth_twitter_secret,
    request_token_url='https://api.twitter.com/oauth/request_token',
)

twitter = auth.create_oauth_app(twitter_config, 'twitter')


@app.route('/_s/callback/twitter/oauth-authorized/')
def twitter_authorized():
    response = twitter.authorized_response()
    if response is None:
        flask.flash('You denied the request to sign in.')
        return flask.redirect(flask.url_for('index'))

    flask.session['oauth_token'] = (
        response['oauth_token'],
        response['oauth_token_secret'],
    )
    user_db = retrieve_user_from_twitter(response)
    return auth.signin_via_social(user_db)


@twitter.tokengetter
def get_twitter_token():
    return flask.session.get('oauth_token')


@app.route('/signin/twitter/')
def signin_twitter():
    return auth.signin_oauth(twitter)


def retrieve_user_from_twitter(response):
    auth_id = 'twitter_%s' % response['user_id']
    user_db = model.User.get_by('auth_ids', auth_id)
    return user_db or auth.create_or_get_user_db(
        auth_id=auth_id,
        name=response['screen_name'],
        username=response['screen_name'],
        verified=True
    )
