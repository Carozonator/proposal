'use strict';

/* Services */


angular.module('app').factory('sessionService', ['$rootScope', '$window', '$http', '$location',
  function ($rootScope, $window, $http, $location) {
    var session = {
      init: function () {
        this.resetSession();
      },
      login: function(userInfo) {
      	console.log("it nevers enters here !");
        var scope = this;
        $http.post('/login', {
          email: userInfo.email,
          password: userInfo.password
        })
        .success(function(response) {
			// authentication OK
			session.currentUser = userInfo;
			session.isLoggedIn = true;
			session.user = userInfo.email;
			session.email = userInfo.email;
			$rootScope.$emit('session-changed');
			console.log(response);
			console.log("------>",$rootScope.user);
			if (response.redirect) {
				if (window.location.href === response.redirect) {
				//This is so an admin user will get full admin page
				window.location.reload();
				} else {
				window.location = response.redirect;
				}
			} else {
				$location.url('/hub');
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
          password: userInfo.password,
          confirmPassword: userInfo.confirmPassword,
          name: userInfo.name,
          lastname: userInfo.lastname,
          email: userInfo.email,
          confirmEmail: userInfo.confirmEmail,
          companyName: userInfo.companyName,
          companySize: userInfo.companySize
        })
        .success(function() {
          $rootScope.currentUser = userInfo;
          $rootScope.isLoggedIn = true;
          $rootScope.user = userInfo.name;
          $rootScope.email = userInfo.email;
          $rootScope.$emit('session-changed');
          $location.url('/hub');
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
        $rootScope.email = userData.email;
        $rootScope.provider=userData.provider;
        if ($location.url() == "/") {
          $location.url('/hub');  
        }
      },
      authFailed: function() {
        this.resetSession();
        alert('Authentication failed');
      }
    };
    session.init();
    return session;
  }]);