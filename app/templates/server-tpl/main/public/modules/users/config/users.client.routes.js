(function() {
    'use strict';

    var module = angular.module('users');
    module.config(function($stateProvider) {
        $stateProvider
            .state('signin', {
                url         : '/signin',
                controller  : 'SigninController',
                templateUrl : '/p/modules/users/auth/signin.client.view.html',
                data        : {
                    signedOutOnly : true
                }
            })
            .state('signup', {
                url         : '/signup',
                controller  : 'SignupController',
                templateUrl : '/p/modules/users/auth/signup.client.view.html',
                data        : {
                    signedOutOnly : true
                }
            })
            .state('signout', {
                url        : '/signout',
                controller : function(Restangular, gaAuthentication, $state, gaAppConfig) {
                    Restangular.all('auth/signout').post().then(function(appConfig) {
                        gaAuthentication.user = false;
                        _.assignDelete(gaAppConfig, appConfig);
                        $state.go('home');
                    });
                }
            })
            .state('forgot', {
                url         : '/password/forgot',
                controller  : 'ForgotController',
                templateUrl : '/p/modules/users/auth/password/forgot.client.view.html',
                data        : {
                    signedOutOnly : true
                }
            })
            .state('reset', {
                url         : '/password/reset/:token',
                controller  : 'ResetController',
                templateUrl : '/p/modules/users/auth/password/reset.client.view.html',
                data        : {
                    signedOutOnly : true
                }
            })
            .state('profile', {
                abstract : true,
                url      : '/user/:username',
                views    : {
                    '' : {
                        templateUrl : '/p/modules/users/profile/profile.client.view.html',
                        controller  : 'ProfileController'
                    }
                }
            })
            .state('profile.view', {
                url         : '',
                templateUrl : '/p/modules/users/profile/profile-view.client.view.html'
            })
            .state('profile.edit', {
                url         : '/edit',
                controller  : 'ProfileEditController',
                templateUrl : '/p/modules/users/profile/profile-edit.client.view.html'
            })
            .state('profile.password', {
                url         : '/password',
                controller  : 'ProfilePasswordController',
                templateUrl : '/p/modules/users/profile/profile-password.client.view.html'
            })
            .state('users', {
                url         : '/users',
                controller  : 'UsersController',
                templateUrl : '/p/modules/users/users-list/users.client.view.html'
            });
    });
}());
