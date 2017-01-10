(function () {
  'use strict';

  angular.module('loginModule')
    .controller('loginController', loginController);

  function loginController($scope, $http, $cookies, $window, configFactory) {

    //Login Submit
    $scope.formGo = (isValid) => {
      if (isValid) { //If form is valid
        let data = $scope.fields;
        let obj = {
          "login": data.user,
          "pass": CryptoJS.MD5(data.pass).toString() //MD5 Pass
        };

        $http.post( //Post to endpoint
          configFactory.endpoints.login,
          obj
        )
        .then((content) => {
          let response = {};
          response.data = content.data.data;
          response.status = content.status;

          if (response.status === 200 || response.status === 201) { //User will be created if non existant
            let user = {
              id: response.data._id,
              login: response.data.login,
              tags: response.data.tags
            };
            $cookies.putObject('User', user);//Set Cookie
            $window.location.href = '/views/tag.html'; //Redirect
          }
        });
      }

    }
  }
})();