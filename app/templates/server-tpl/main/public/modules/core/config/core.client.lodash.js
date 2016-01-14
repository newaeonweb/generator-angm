/**
 * Lodash Config
 * @namespace Config
 */

(function() {
    'use strict';

    var module = angular.module('core');

    /**
     * @namespace Lodash
     * @description
     * In this function you can extend lodash functionality by adding custom functions
     */

    module.run(function(_) {
        var methods = {};

        /**
         * @name assignDelete
         * @memberOf Lodash
         *
         * @description
         * This method assigns obj2 properties to obj1 and deletes obj1 properties, which are not in obj2
         * This is useful, when we want to assign one object to another, but don't want to change pointer
         * of that object, so angular's two-way binding will still work
         *
         * @param {Object} obj1 destination object
         * @param {Object} obj2 source object
         *
         * @example
         *
         * var obj1 = {a: 1, b: 2, c: 3};
         * _.assignDelete(obj1, {b: 8, c: 9})
         * obj1
         * // => {b: 8, c: 9}
         *
         */
        methods.assignDelete = function(obj1, obj2) {
            _.assign(obj1, obj2);
            _.each(_.difference(_.keys(obj1), _.keys(obj2)), function(propName) {
                delete obj1[propName];
            });
        };

        _.each(methods, function(method, methodName) {
            _[methodName] = _.bind(method, _);
        });
    });

}());
