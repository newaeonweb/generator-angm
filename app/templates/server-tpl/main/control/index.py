# coding: utf-8
"""
Provides logic for rendering index template
"""
import flask

from main import app
import auth
import config
from model import User, UserValidator, Config
from api.helpers import ArgumentValidator

@app.route('/')
def index():
    """Render index template"""
    return flask.render_template('index.html')


@app.context_processor
def inject_user():
    """Injects 'user' variable into jinja template, so it can be passed into angular. See base.html"""
    user = False
    if auth.is_logged_in():
        user = auth.current_user_db().to_dict(include=User.get_private_properties())
    return {
        'user': user
    }


@app.context_processor
def inject_config():
    """Injects 'app_config' variable into jinja template, so it can be passed into angular. See base.html"""
    config_properties = Config.get_all_properties() if auth.is_admin() else Config.get_public_properties()
    app_config = config.CONFIG_DB.to_dict(include=config_properties)
    app_config['development'] = config.DEVELOPMENT
    return {
        'app_config': app_config
    }


@app.context_processor
def inject_validators():
    """Injects 'validators' variable into jinja template, so it can be passed into angular. See base.html
    Model validators are passed to angular so it can be used for frontend input validation as well
    This prevents code repetition, as we e.g we change property of UserValidator.name to [5, 20]
    and the same validation of user's name (length between 5-20 characters) will be performed in frontend
    as well as in backend
    """
    return {
        'validators': {
            'arg': ArgumentValidator.to_dict(),
            'user': UserValidator.to_dict()
        }
    }


@app.route('/_ah/warmup')
def warmup():
    """Warmup requests load application code into a new instance before any live requests reach that instance.
    For more info see GAE docs"""
    return 'success'
