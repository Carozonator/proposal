'use strict';

/* Services */


angular.module('app').factory('sessionService', ['$rootScope', '$window', '$http', '$location',
  function ($rootScope, $window, $http, $location) {
    var session = {
      init: function () {
        this.resetSession();
      },
      login: function(userInfo) {
        var scope = this;
        $http.post('/login', {
          email: userInfo.email,
          password: userInfo.password
        })
        .success(function(response) {
          // authentication OK
          scope.currentUser = userInfo;
          scope.isLoggedIn = true;
          $rootScope.user = userInfo.name;
          $rootScope.$emit('session-changed');
          if (response.redirect) {
            if (window.location.href === response.redirect) {
              //This is so an admin user will get full admin page
              window.location.reload();
            } else {
              window.location = response.redirect;
            }
          } else {
            $location.url('/create');
          }
        })
        .error(function(response) {
          $rootScope.loginError = "Your login information is incorrect.";
        });
      },
      register: function(userInfo) {
        var scope = this;
        $rootScope.usernameError = null;
        $rootScope.registerError = null;
        $http.post('/register', {
          email: userInfo.email,
          password: userInfo.password,
          confirmPassword: userInfo.confirmPassword,
          username: userInfo.username,
          name: userInfo.name
        })
        .success(function() {
          scope.currentUser = userInfo;
          scope.isLoggedIn = true;
          $rootScope.user = userInfo.name;
          $rootScope.$emit('session-changed');
          $location.url('/create');
        })
        .error(function(error) {
          // Error: authentication failed
          $rootScope.registerError = error;
        });
      },
      resetSession: function() {
        this.currentUser = null;
        this.isLoggedIn = false;
      },
      facebookLogin: function() {
        var url = '/auth/facebook',
        width = 1000,
        height = 650,
        top = (window.outerHeight - height) / 2,
        left = (window.outerWidth - width) / 2;
        $window.open(url, 'facebook_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
      },
      logout: function() {
        var scope = this;
        $http.get('/logout').success(function() {
          scope.resetSession();
          $rootScope.$emit('session-changed');
        });
        $location.url('/');
      },
      authSuccess: function(userData) {
        this.currentUser = userData;
        this.isLoggedIn = true;
        $rootScope.$emit('session-changed');
        $rootScope.user = userData.user;
        $location.url('/create');
      },
      authFailed: function() {
        this.resetSession();
        alert('Authentication failed');
      }
    };
    session.init();
    return session;
  }]);