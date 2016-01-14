(function() {
    'use strict';
    var module = angular.module('users');

    module.controller('ProfileController', function($scope, Restangular, gaAppConfig, gaAuthentication, $stateParams,
                                                    _, $mdDialog, gaToast, $state) {
        $scope.cfg = gaAppConfig;
        $scope.auth = gaAuthentication;
        $scope.isMyProfile = function() {
            return gaAuthentication.isLogged() && $stateParams.username === gaAuthentication.user.username;
        };

        if ($scope.isMyProfile()) {
            $scope.user = gaAuthentication.user;
        } else {
            Restangular.one('users', $stateParams.username).get().then(function(user) {
                $scope.user = user;
            });
        }

        $scope.getAvailableSocialAccounts = function() {
            if (!$scope.user) {
                return;
            }
            return _.pick($scope.socialAccounts, function(soc, socKey) {
                /*jslint unparam:true*/
                return !!$scope.user[socKey];
            });
        };

        $scope.hasAuthorization = function() {
            return $scope.isMyProfile() || $scope.auth.isAdmin();
        };

        $scope.showDeleteUserDialog = function(ev) {
            var confirm = $mdDialog.confirm()
                .title('Do you really want to delete user ' + $scope.user.username)
                .content('Note, these deletion is irreversible')
                .ariaLabel('Delete User')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function() {
                $scope.user.remove().then(function() {
                    gaToast.show('User ' + $scope.user.username + ' was deleted');
                    $state.go('users');
                });
            });
        };

        $scope.socialAccounts = {
            facebook  : {
                domain : 'facebook.com',
                name   : 'Facebook'
            },
            twitter   : {
                domain : 'twitter.com',
                name   : 'Twitter'
            },
            gplus     : {
                domain : 'plus.google.com',
                name   : 'Google Plus'
            },
            instagram : {
                domain : 'instagram.com',
                name   : 'Instagram'
            },
            linkedin  : {
                domain : 'linkedin.com',
                name   : 'Linkedin'
            },
            github    : {
                domain : 'github.com',
                name   : 'Github'
            }
        };
    });
}());
