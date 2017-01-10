(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('configFactory', configFactory);
  
  function configFactory() {
    return {
      endpoints: {
        login: "http://localhost:8088/login",
        get_user: "http://localhost:8088/user/",
        new_tag: "http://localhost:8088/tag",
        get_tag: "http://localhost:8088/tag/"
      }
    };
  }
})()