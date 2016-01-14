(function() {
    'use strict';
    var module = angular.module('core');

    /**
     * @name gaToast
     * @memberOf angularModule.core
     * @description
     * Service responsible tracking user's activity on page
     * Currenly works only with Google Analytics
     */

    module.factory('gaTracking', function($analytics) {

        return {
            eventTrack : function(eventName, label, category) {
                $analytics.eventTrack(eventName, {
                    label     : label,
                    categoory : category
                });
            }
        };

    });

}());
