#!/usr/bin/env python
# coding: utf-8
# pylint: disable=global-statement
"""This module runs dev_appserver.py, creates virtualenv, performs requirements check,
creates necessary directories
"""
from distutils import spawn
import argparse
import os
import platform
import shutil
import sys


###############################################################################
# Options
###############################################################################
PARSER = argparse.ArgumentParser()
PARSER.add_argument(
    '-o', '--host', dest='host', action='store', default='127.0.0.1',
    help='the host to start the dev_appserver.py',
)
PARSER.add_argument(
    '-p', '--port', dest='port', action='store', default='8080',
    help='the port to start the dev_appserver.py',
)
PARSER.add_argument(
    '-f', '--flush', dest='flush', action='store_true',
    help='clears the datastore, blobstore, etc',
)
PARSER.add_argument(
    '--appserver-args', dest='args', nargs=argparse.REMAINDER, default=[],
    help='all following args are passed to dev_appserver.py',
)
ARGS = PARSER.parse_args()


###############################################################################
# Globals
###############################################################################
GAE_PATH = ''
IS_WINDOWS = platform.system() == 'Windows'


###############################################################################
# Directories
###############################################################################
DIR_MAIN = 'main'
DIR_TEMP = 'temp'
DIR_VENV = os.path.join(DIR_TEMP, 'venv')

DIR_LIB = os.path.join(DIR_MAIN, 'lib')
DIR_LIBX = os.path.join(DIR_MAIN, 'libx')
FILE_REQUIREMENTS = 'requirements.txt'

FILE_VENV = os.path.join(DIR_VENV, 'Scripts', 'activate.bat') \
    if IS_WINDOWS \
    else os.path.join(DIR_VENV, 'bin', 'activate')

DIR_STORAGE = os.path.join(DIR_TEMP, 'storage')


###############################################################################
# Helpers
###############################################################################
def make_dirs(directory):
    """Creates directories"""
    if not os.path.exists(directory):
        os.makedirs(directory)


def os_execute(executable, args, source, target, append=False):
    """Executes OS command"""
    operator = '>>' if append else '>'
    os.system('%s %s %s %s %s' % (executable, args, source, operator, target))


def listdir(directory, split_ext=False):
    """Lists directory"""
    try:
        if split_ext:
            return [os.path.splitext(dir_)[0] for dir_ in os.listdir(directory)]
        else:
            return os.listdir(directory)
    except OSError:
        return []


def site_packages_path():
    """Gets path of site-packages folder with third party libraries on system"""
    if IS_WINDOWS:
        return os.path.join(DIR_VENV, 'Lib', 'site-packages')
    py_version = 'python%s.%s' % sys.version_info[:2]
    return os.path.join(DIR_VENV, 'lib', py_version, 'site-packages')


def create_virtualenv():
    """Creates virtialenv into temp folder if it doesn't exists"""
    if not os.path.exists(FILE_VENV):
        os.system('virtualenv --no-site-packages %s' % DIR_VENV)
        os.system('echo %s >> %s' % (
            'set PYTHONPATH=' if IS_WINDOWS else 'unset PYTHONPATH', FILE_VENV
        ))
        pth_file = os.path.join(site_packages_path(), 'gae.pth')
        echo_to = 'echo %s >> {pth}'.format(pth=pth_file)
        os.system(echo_to % find_gae_path())
        os.system(echo_to % os.path.abspath(DIR_LIBX))
        fix_path_cmd = 'import dev_appserver; dev_appserver.fix_sys_path()'
        os.system(echo_to % (
            fix_path_cmd if IS_WINDOWS else '"%s"' % fix_path_cmd
        ))
    return True


def exec_pip_commands(command):
    """Executes pip command on system"""
    script = []
    if create_virtualenv():
        activate_cmd = 'call %s' if IS_WINDOWS else 'source %s'
        activate_cmd %= FILE_VENV
        script.append(activate_cmd)

    script.append('echo %s' % command)
    script.append(command)
    script = '&'.join(script) if IS_WINDOWS else \
        '/bin/bash -c "%s"' % ';'.join(script)
    os.system(script)


def install_py_libs():
    """Installs requirements from requirements file and then copies them
    from site-packages folder into main/lib folder
    Alse excludes files that don't need to be deployed"""
    exec_pip_commands('pip install -q -r %s' % FILE_REQUIREMENTS)

    exclude_ext = ['.pth', '.pyc', '.egg-info', '.dist-info']
    exclude_prefix = ['setuptools-', 'pip-', 'Pillow-']
    exclude = [
        'test', 'tests', 'pip', 'setuptools', '_markerlib', 'PIL',
        'easy_install.py', 'pkg_resources.py'
    ]

    def _exclude_prefix(pkg): # pylint: disable=missing-docstring
        for prefix in exclude_prefix:
            if pkg.startswith(prefix):
                return True
        return False

    def _exclude_ext(pkg): # pylint: disable=missing-docstring
        for ext in exclude_ext:
            if pkg.endswith(ext):
                return True
        return False

    def _get_dest(pkg): # pylint: disable=missing-docstring
        make_dirs(DIR_LIB)
        return os.path.join(DIR_LIB, pkg)

    site_packages = site_packages_path()
    dir_libs = listdir(DIR_LIB)
    dir_libs.extend(listdir(DIR_LIBX))
    for dir_ in listdir(site_packages):
        if dir_ in dir_libs or dir_ in exclude:
            continue
        if _exclude_prefix(dir_) or _exclude_ext(dir_):
            continue
        src_path = os.path.join(site_packages, dir_)
        copy = shutil.copy if os.path.isfile(src_path) else shutil.copytree
        copy(src_path, _get_dest(dir_))


def install_dependencies():
    """Installs python dependencies"""
    make_dirs(DIR_TEMP)
    install_py_libs()


###############################################################################
# Doctor
###############################################################################

def check_requirement(check_func):
    """Executes check function for given requirement

    Args:
        check_func (function): check function, which should return True if requirement
            is satisfied

    Returns:
        bool: True if requirement is OK

    """
    result, name = check_func()
    if not result:
        print '[ERR] %s was NOT FOUND' % name
        return False
    return True


def find_gae_path():
    """Tries to find GAE's dev_appserver.py executable

    Returns:
        string: Absolute path of dev_appserver.py or empty string
    """
    global GAE_PATH
    if GAE_PATH:
        return GAE_PATH
    if IS_WINDOWS:
        gae_path = None
        for path in os.environ['PATH'].split(os.pathsep):
            if os.path.isfile(os.path.join(path, 'dev_appserver.py')):
                gae_path = path
    else:
        gae_path = spawn.find_executable('dev_appserver.py')
        if gae_path:
            gae_path = os.path.dirname(os.path.realpath(gae_path))
    if not gae_path:
        return ''
    gcloud_exec = 'gcloud.cmd' if IS_WINDOWS else 'gcloud'
    if not os.path.isfile(os.path.join(gae_path, gcloud_exec)):
        GAE_PATH = gae_path
    else:
        gae_path = os.path.join(gae_path, '..', 'platform', 'google_appengine')
        if os.path.exists(gae_path):
            GAE_PATH = os.path.realpath(gae_path)
    return GAE_PATH


def check_gae():
    """Checks if Google App Engine is present on system"""
    return bool(find_gae_path()), 'Google App Engine SDK'


def check_pip():
    """Checks if pip is present on system"""
    return bool(spawn.find_executable('pip')), 'pip'


def check_virtualenv():
    """Checks if virtualenv is present on system"""
    return bool(spawn.find_executable('virtualenv')), 'virtualenv'


def doctor_says_ok():
    """Executes all check functions

    Returns:
        bool: True only iif all chcek functions return True
    """
    checkers = [check_gae, check_pip, check_virtualenv]
    if False in [check_requirement(check) for check in checkers]:
        sys.exit(1)
    return True


###############################################################################
# Main
###############################################################################

def run_dev_appserver():
    """Runs dev_appserver.py with given arguments"""
    make_dirs(DIR_STORAGE)
    clear = 'yes' if ARGS.flush else 'no'
    port = int(ARGS.port)
    args = [
        '"%s"' % os.path.join(find_gae_path(), 'dev_appserver.py'),
        DIR_MAIN,
        '--host %s' % ARGS.host,
        '--port %s' % port,
        '--admin_port %s' % (port + 1),
        '--storage_path=%s' % DIR_STORAGE,
        '--clear_datastore=%s' % clear,
        '--skip_sdk_update_check',
    ] + ARGS.args

    run_command = ' '.join(args)
    os.system(run_command)


def run():
    """Runs this script"""
    os.chdir(os.path.dirname(os.path.realpath(__file__)))
    if doctor_says_ok():
        install_dependencies()
        run_dev_appserver()

if __name__ == '__main__':
    run()
