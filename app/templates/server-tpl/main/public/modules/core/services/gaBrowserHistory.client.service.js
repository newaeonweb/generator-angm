(function() {
    'use strict';
    var module = angular.module('core');

    /**
     * @name gaBrowserHistory
     * @memberOf angularModule.core
     * @description
     * Keeps track of states user navigates
     */

    module.factory('gaBrowserHistory', function($state, $rootScope, _, gaAuthentication) {
        var history = [];
        var ignoredStates = ['signout'];

        return {
            /**
             * Initialize browser history. This has to be run on app startup
             */
            init : function() {
                history = [];
                /*jslint unparam:true*/
                $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                    if (fromState.abstract || _.contains(ignoredStates, fromState.name)) {
                        return;
                    }
                    history.push({
                        state  : fromState,
                        params : fromParams
                    });
                });
            },
            /**
             * Navigates back to previous state
             * If user is logged and his previous state was signin page, it won't redirect there
             */
            back : function() {
                var state = history.pop();
                if (!state || (gaAuthentication.isLogged() && state.state.data && state.state.data.signedOutOnly)) {
                    $state.go('home');
                } else {
                    $state.go(state.state, state.params);
                }
            }
        };

    });

}());
