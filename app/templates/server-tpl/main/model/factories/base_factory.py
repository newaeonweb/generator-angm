# pylint: disable=no-init, old-style-class
"""Provides implementation of BaseFactory"""

from gaendb.factories import NDBFactory
from google.appengine.ext import ndb
import factory


class BaseFactory(NDBFactory):
    """Base factory for factory_boy classes, for generating fixtures
    This class should be extended"""

    class Meta: # pylint: disable=missing-docstring
        abstract = True
        strategy = factory.CREATE_STRATEGY

    @classmethod
    def create_batch(cls, size, **kwargs):
        """Firstly deletes all entries from datastore and then
         creates batch of new entries"""
        ndb.delete_multi(cls._meta.model.query().fetch(keys_only=True))
        super(BaseFactory, cls).create_batch(size, **kwargs)

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        """Since we use factory.CREATE_STRATEGY this function will be called at the moment
        of creating instance of this class.
        Note put_async here, to benefit from parallel puts, top level function, such as one in generate_db_api.py
        must use decorator @ndb.toplevel"""
        obj = model_class(*args, **kwargs)
        obj.put_async()
        return obj
