(function () {
  'use strict';

  angular.module('tagModule')
    .controller('tagHeaderController', tagHeaderController);
  
  function tagHeaderController($scope, $cookies, $window, configFactory, $http) { //Controller for the header part of the app
    $scope.logOut = () => { //Log out button
      $cookies.remove('User'); //Removes cookie and redirects
      $window.location.href = "/views/login.html";
    };

    $scope.init = () => { //Sets initial values
      let User = $cookies.get('User')
      if(!User) return $window.location.href = "/views/login.html";
      $scope.user = JSON.parse(User);
    };
  }
})();