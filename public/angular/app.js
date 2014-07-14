'use strict';


// Declare app level module which depends on filters, and services
angular.module('app', [
  'ngRoute',
  'ngAnimate',
  'ui.sortable',
  'localytics.directives']).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
  	templateUrl: 'partials/frontpage.html', 
  	controller: 'homeCtrl'
  });
  $routeProvider.when('/create', {
  	templateUrl: 'partials/create.html', 
  	controller: 'createController'
  });
  $routeProvider.when('/hub', {
    templateUrl: 'partials/hub.html',
    controller: 'hubController'
  });
  $routeProvider.when('/pagebuilder',{
    templateUrl: 'partials/pagemaker.html',
    controller: 'builderCtrl'
  });
  $routeProvider.otherwise({redirectTo: '/'});
}]).run(['$rootScope', '$window', 'sessionService',
function ($rootScope, $window, sessionService) {
  $rootScope.session = sessionService;
  $window.app = {
    authState: function(state, user) {
      $rootScope.$apply(function() {
        switch (state) {
          case 'success':
          sessionService.authSuccess(user);
          break;
          case 'failure':
          sessionService.authFailed();
          break;
        }

      });
    }
  };

  if ($window.user !== null) {
    sessionService.authSuccess($window.user);
  }
}]);