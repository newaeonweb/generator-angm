# coding: utf-8
"""
This module inserts third party libraries into Google's python PATHs
In production we import this from lib.zip file, whereas in development
from main/lib folder
"""
import os
import sys


if os.environ.get('SERVER_SOFTWARE', '').startswith('Google App Engine'):
    sys.path.insert(0, 'lib.zip')
else:
    import re
    from google.appengine.tools.devappserver2.python import stubs #pylint: disable=import-error
    # pylint: disable=invalid-name
    # since lib folder is normally in skip_files in yaml, while developing
    # we want server to include this folder, so we remove it from skip_files
    re_ = stubs.FakeFile._skip_files.pattern.replace('|^lib/.*', '')  # pylint: disable=protected-access
    re_ = re.compile(re_)
    stubs.FakeFile._skip_files = re_ # pylint: disable=protected-access
    sys.path.insert(0, 'lib')
sys.path.insert(0, 'libx')
