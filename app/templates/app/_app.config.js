(function() {
    'use strict';

    angular
        .module('<%= slugifiedAppName %>')
        .config(configure)
        .run(runBlock);

    configure.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider'];

    function configure ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        $locationProvider.hashPrefix('!');

        // This is required for Browser Sync to work poperly
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        $urlRouterProvider
            .otherwise('/');

    }

    runBlock.$inject = ['$rootScope'];

    function runBlock ($rootScope) {
        'use strict';

        console.log('AngularJS run() function...');
    }


})();
