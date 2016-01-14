(function() {
    'use strict';
    var module = angular.module('core');

    /**
     * @name gaCaptcha
     * @memberOf angularModule.core
     * @description
     * This directive inserts no-captcha into page.
     * In order to display captcha certain conditions must be met:
     * - Captcha must be enabled for form, in which this directive is. This can be enabled/disabled via Admin Interface
     * - Admin must set recaptcha_public_key & recaptcha_private_key
     * - If captcha has attribute anonymousOnly, logged users won't see it
     */
    module.directive('gaCaptcha', function(gaAppConfig, gaAuthentication) {
        /*jslint unparam:true*/
        var prelink = function(scope, el, attrs, form) {
            //jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            var anonOnly = attrs.anonymousOnly !== undefined && attrs.anonymousOnly !== 'false';
            scope.isEnabled = gaAppConfig.has_recaptcha;
            // gaAppConfig.recaptcha_forms contains list of form names e.g 'signinForm' from '<form name="signinForm">'
            // which should display captcha, if the form name is not in the list, captcha won't be displayed even
            // if directive is in the form
            if ((anonOnly && gaAuthentication.isLogged()) || !gaAppConfig.recaptcha_forms[form.$name]) {
                scope.isEnabled = false;
            }
            scope.recaptcha_public_key = gaAppConfig.recaptcha_public_key;
            if (!scope.isEnabled) {
                attrs.$set('ngRequired', false);
            }
        };

        return {
            link     : {
                pre : prelink
            },
            restrict : 'EA',
            require  : '^form',
            scope    : {
                ngModel       : '=',
                control       : '=',
                anonymousOnly : '@',
                'class'       : '@'
            },
            template : [
                '<no-captcha',
                'ng-if="isEnabled"',
                'class="no-captcha {{ class }}"',
                'theme="light"',
                'g-recaptcha-response="$parent.ngModel"',
                'control="$parent.control"',
                'site-key="{{ recaptcha_public_key }}">',
                '</no-captcha>'
            ].join(' ')
        };
    });

}());
