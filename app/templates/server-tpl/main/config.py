# coding: utf-8
"""
Global config variables. Config variables stored in DB are loaded into CONFIG_DB variable
"""
import os
from datetime import datetime
from google.appengine.api import app_identity #pylint: disable=import-error


PRODUCTION = os.environ.get('SERVER_SOFTWARE', '').startswith('Google App Eng')
DEVELOPMENT = not PRODUCTION
APPLICATION_ID = app_identity.get_application_id()
CURRENT_VERSION_ID = os.environ.get('CURRENT_VERSION_ID')
CURRENT_VERSION_NAME = CURRENT_VERSION_ID.split('.')[0]
CURRENT_VERSION_TIMESTAMP = long(CURRENT_VERSION_ID.split('.')[1]) >> 28
if DEVELOPMENT:
    import calendar

    CURRENT_VERSION_TIMESTAMP = calendar.timegm(datetime.utcnow().timetuple())
CURRENT_VERSION_DATE = datetime.utcfromtimestamp(CURRENT_VERSION_TIMESTAMP)
# model needs to be improted after setting CURRENT_VERSION_DATE, since model.Base
# uses is as default value for version property
import model
CONFIG_DB = model.Config.get_master_db()
SECRET_KEY = CONFIG_DB.flask_secret_key.encode('ascii')

