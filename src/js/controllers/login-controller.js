(function () {
  'use strict';

  angular.module('loginModule')
    .controller('loginController', loginController);

  function loginController($scope, $http, $cookies, $window, configFactory) {
    $scope.formGo = (isValid) => {
      if (isValid) {
        let data = $scope.fields;
        let obj = {
          "login": data.user,
          "pass": CryptoJS.MD5(data.pass).toString()
        };

        $http.post(
          configFactory.endpoints.login,
          obj
        )
        .then((content) => {
          let response = {};
          response.data = content.data.data;
          response.status = content.status;
          if (response.status === 200 || response.status === 201) {
            let user = {
              id: response.data._id,
              login: response.data.login,
              tags: response.data.tags
            };
            $cookies.putObject('User', user);
            $window.location.href = '/views/tag.html';
          }
        });
      }

    }
  }
})();