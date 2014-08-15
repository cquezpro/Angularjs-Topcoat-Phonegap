'use strict';

angular.module('myApp', [
    'ngTouch',
    'ngRoute',
    'ngAnimate',
	'ngMap',
    'myApp.controllers',
])
.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
	$routeProvider.when('/zones', {templateUrl: 'partials/zone-list.html', controller: 'ZonesCtrl'});
	$routeProvider.when('/homegroups', {templateUrl: 'partials/homegroups.html', controller: 'GroupsCtrl'});
	$routeProvider.when('/familygroup', {templateUrl: 'partials/familygroup.html', controller: 'FamilyGroupCtrl'});
	$routeProvider.when('/family', {templateUrl: 'partials/family.html', controller: 'FamilyCtrl'});
	$routeProvider.when('/member', {templateUrl: 'partials/member.html', controller: 'MemberCtrl'});
    $routeProvider.otherwise({redirectTo: '/login'});
}]);