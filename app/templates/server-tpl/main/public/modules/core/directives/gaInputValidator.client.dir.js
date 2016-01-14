(function() {
    'use strict';
    var module = angular.module('core');

    /**
     * @name gaInputValidator
     * @memberOf angularModule.core
     * @description
     * This directive automatically adds following directives to element:
     * - (md-maxlength or ng-maxlength) with ng-minlength
     * - ng-pattern
     * Values for these directives are from python model validator factories (see BaseValidator in model/base.py)
     * Let's take for example user validator class:
     *
     * class UserValidator(model.BaseValidator):
     *      name = [3, 100]
     *
     * This min/max value for name is then passed to client as gaValidators.user.name === [3, 100]
     * Now, when we use directive:
     * <input name="name" ga-input-validator validator-category="user">
     * It will autmatically adds ng-minlength and ng-maxlength like this:
     * <input name="name" ga-input-validator ng-minlength="3" ng-maxlength="100" validator-category="user">
     *
     * If you want to use md-maxlength to show character counter pass show-counter="true"
     */
    module.directive('gaInputValidator', function($compile, gaValidators, _) {
        var compile = function(el, attrs) {
            var type = attrs.gaInputValidator || attrs.name;
            var values = gaValidators[attrs.validatorCategory][type];
            if (_.isArray(values)) {
                if (values[0] > 0) {
                    attrs.$set('ng-minlength', values[0]);
                }
                if (values[1] > 0) {
                    var maxType = attrs.showCounter === 'true' ? 'md-maxlength' : 'ng-maxlength';
                    attrs.$set(maxType, values[1]);
                }
            } else {
                attrs.$set('ng-pattern', '/' + values + '/');
            }

            //Now that we added new directives to the element, proceed with compilation
            //but skip directives with priority 5000 or above to avoid infinite
            //recursion (we don't want to compile ourselves again)
            var compiled = $compile(el, null, 5000);
            return function(scope) {
                compiled(scope);
            };
        };

        return {
            priority : 5000, // High priority means it will execute first
            terminal : true, //Terminal prevents compilation of any other directive on first pass
            compile  : compile,
            restrict : 'A'
        };
    });

}());
