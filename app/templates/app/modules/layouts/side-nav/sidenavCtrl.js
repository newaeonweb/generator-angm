'use strict';

(function() {

	/**
	* @ngdoc function
	* @name app.controller:HomeCtrl
	* @description
	* # HomeCtrl
	* Controller of the app
	*/
	angular
	.module('<%= slugifiedAppName %>')
	.controller('SidenavCtrl', SidenavCtrl)
  .controller('SettingsCtrl', SettingsCtrl);

  // Injecting Denpendencies

  SidenavCtrl.$inject = ['$mdSidenav', '$state', '$mdBottomSheet', '$mdToast', 'MenuService'];
  SettingsCtrl.$inject = ['$mdBottomSheet'];

	/*
	* recommend
	* Using function declarations
	* and bindable members up top.
	*/

	function SidenavCtrl($mdSidenav, $state, $mdBottomSheet, $mdToast, MenuService) {
		/*jshint validthis: true */
		var vm = this;

        vm.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };

        vm.menu = MenuService.listMenu();

        vm.admin = [
            {
              link : 'showListBottomSheet($event)',
              title: 'Settings',
              icon: 'settings'
            }
        ];

        vm.navigateTo = function(target) {

            var page = target;

            $state.go(page);

        };

        vm.showSettingsBottom = function ($event) {
            vm.alert = '';
            $mdBottomSheet.show({
                template: '<md-bottom-sheet class="md-grid" layout="column" ng-cloak><div layout="row" layout-align="center center"><h4>With clickOutsideToClose option, drag down or press ESC to close</h4></div><md-list flex layout="row" layout-align="center center"><md-list-item ng-repeat="item in vm.items"><md-button class="md-grid-item-content" ng-click="vm.listItemClick($index)"><md-icon class="md-48">{{item.icon}}</md-icon><div class="md-grid-text"> {{ item.name }} </div></md-button></md-list-item></md-list></md-bottom-sheet>',
                controller: 'SettingsCtrl',
                controllerAs: 'vm',
                targetEvent: $event
            }).then(function (clickedItem) {
                $mdToast.show(
                    $mdToast.simple()
                        .content(clickedItem['name'] + ' clicked!')
                        .position('top right')
                        .hideDelay(2000)
                );
            });
        };

	}

    function SettingsCtrl($mdBottomSheet) {
        /*jshint validthis: true */
		var vm = this;

        vm.items = [
            { name: 'Roles', icon: 'assignment_ind' },
            { name: 'Notes', icon: 'speaker_notes' },
            { name: 'Tasks', icon: 'view_list' },
            { name: 'Inbox', icon: 'inbox' }
        ];

        vm.listItemClick = function ($index) {
            var clickedItem = vm.items[$index];
            $mdBottomSheet.hide(clickedItem);
        };
    }

})();
