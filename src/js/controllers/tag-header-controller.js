(function () {
  'use strict';

  angular.module('tagModule')
    .controller('tagHeaderController', tagHeaderController);
  
  function tagHeaderController($scope, $cookies, $window, configFactory, $http) {
    $scope.logOut = () => {
      $cookies.remove('User');
      $window.location.href = "/views/login.html";
    };

    $scope.init = () => {
      let User = $cookies.get('User')
      if(!User) return $window.location.href = "/views/login.html";
      $scope.user = JSON.parse(User);
    };
  }
})();