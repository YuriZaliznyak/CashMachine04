(function () {

    'use strict';

    angular
        .module('atmApp', [
            'ngResource',
            'ngRoute',
            'ui.bootstrap'
            //'ngInput'
        ])


        .config(function ($routeProvider) {
            $routeProvider
                .when('/startpage', {
                    templateUrl: 'views/startpage.html',
                    controller: 'startPageController'
                })
                .when('/balancepage', {
                    templateUrl: 'views/balancepage.html',
                    controller: 'balancePageController'
                })
                .when('/manageusers', {
                    templateUrl: 'views/manageuserspage.html',
                    controller: 'manageUsersPageController'
                })
                .otherwise({
                    redirectTo: '/startpage'
                });

        });
})();