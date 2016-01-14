(function() {
    'use strict';

    var module = angular.module('core');

    module.constant('_', _);

    module.config(function($locationProvider, RestangularProvider, $mdThemingProvider) {
        $locationProvider.html5Mode(false);

        RestangularProvider
            .setBaseUrl('/api/v1')
            .setRestangularFields({
                id : 'key'
            });

        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('pink');
    });

    module.run(function(Restangular, gaToast, $state, $rootScope, $timeout, gaFlashMessages, _,
                        gaAuthentication, gaBrowserHistory) {
        var loadingPromise;
        var endLoading = function() {
            $timeout.cancel(loadingPromise);
            $rootScope.isLoading = false;
        };

        if (gaAuthentication.isLogged()) {
            gaAuthentication.user = Restangular.restangularizeElement(null, gaAuthentication.user, 'users');
        }

        gaBrowserHistory.init();

        Restangular.setErrorInterceptor(function(res) {
            endLoading();
            var msg = res.data && res.data.message ? res.data.message :
                'Sorry, I failed so badly I can\'t even describe it :(';
            if (res.status === 403) {
                gaToast.show('Sorry, you\'re not allowed to do it, please sign in with different account');
                $state.go('signin');
            } else if (res.status === 401) {
                gaToast.show('Please sign in first!');
                $state.go('signin');
            } else if (res.status === 404) {
                gaToast.show('Sorry, this requested page doesn\'t exist');
                gaBrowserHistory.back();
            } else {
                gaToast.show(msg);
            }
            return true;
        });

        Restangular.addRequestInterceptor(function(element, operation) {
            // This is just convenient loading indicator, so we don't have to do it in every controller
            // separately. It's mainly used to disable submit buttons, when request is sent. There's also
            // added little delay so disabling buttons looks more smoothly
            loadingPromise = $timeout(function() {
                $rootScope.isLoading = true;
            }, 500);

            // Flask responds with error, when DELETE method contains body, so we remove it
            if (operation === 'remove') {
                return undefined;
            }
            return element;
        });
        Restangular.addResponseInterceptor(function(data) {
            endLoading();
            return data;
        });

        /**
         * This interceptor extracts meta data from list response
         * This meta data can be:
         *      cursor - ndb Cursor used for pagination
         *      totalCount - total count of items
         *      more - whether datastore contains more items, in terms of pagination
         */
        Restangular.addResponseInterceptor(function(data, operation) {
            var extractedData;
            if (operation === 'getList') {
                extractedData = data.list;
                extractedData.meta = data.meta;
            } else {
                extractedData = data;
            }
            return extractedData;
        });

        /**
         * If there are FlashMessages from server, toast will display them
         */
        if (!_.isEmpty(gaFlashMessages)) {
            $timeout(function() {
                gaToast.show(gaFlashMessages[0], {
                    delay : 10000
                });
            }, 1000);
        }

        $rootScope.$on('$stateChangeError', function() {
            gaToast.show('Sorry, there was a error while loading that page.');
        });

        /**
         * Fires off when content was scrolled to bottom. This is defined in base.html
         */
        $rootScope.mainContentScrolled = function() {
            $rootScope.$broadcast('mainContentScrolled');
        };

    });

}());
