(function () {
  'use strict';

  angular.module('tagModule')
    .controller('tagMainController', tagMainController);

  function tagMainController($scope, $http) {
    $scope.photos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    $scope.image_size = 500;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
})();