(function () {
  'use strict';

  angular.module('tagModule')
    .directive('tagList', tagList)
    .directive('imgList', imgList);

  function tagList() {
    let ddo = {};
    ddo.restrict = "E";

    return ddo;
  }

  function imgList() {
    let ddo = {};
    ddo.restrict = "E";

    return ddo;
  }
})();