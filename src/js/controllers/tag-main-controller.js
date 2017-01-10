(function () {
  'use strict';

  angular.module('tagModule')
    .controller('tagMainController', tagMainController);

  function tagMainController($scope, $http, $window, $cookies, configFactory) {
    $scope.init = () => {
      let User = $cookies.get('User');
      $scope.photos = [];
      if(!User) return $window.location.href = "/views/login.html";
      $scope.user = JSON.parse(User);
    };

    $scope.saveTag = (isValid) => {
      if (isValid) {
        let obj = { user_id: $scope.user.id, tag: $scope.tagSearch.name }
        
        $http.post(configFactory.endpoints.new_tag, obj)
          .then((response) => {
            let code = response.status;
            $scope.searchTag($scope.tagSearch.name);
            $scope.tagSearch.name = "";

            if (code == 201) {
              return recreateUser($cookies, $scope, $http, configFactory);
            } else if (code == 304) {
              return false;
            }
          });
      }
    };

    $scope.searchTag = (tagName) => {
      $scope.photos = {};
      $scope.tag_search_name = ": #" + tagName;
      $scope.isLoading = true;
      $http.get(configFactory.endpoints.get_tag + tagName)
        .then((response) => {
          $scope.isLoading = false;
          $scope.photos = response.data;
      })
    };

    $scope.removeTag = (tagId) => {
      $http.delete(configFactory.endpoints.get_tag + $scope.user.id + "/" + tagId)
        .then((response) => {
          return recreateUser($cookies, $scope, $http, configFactory);
        });
    }

  }

  function recreateUser(cookieCtl, scope, ajax, configs) {
    let obj = {};

    ajax.get(configs.endpoints.get_user + scope.user.id)
      .then((response) => {
        let userData = response.data.data;
        obj = {
          id: userData._id,
          login: userData.login,
          tags: userData.tags
        };
        cookieCtl.remove("User");
        cookieCtl.putObject("User", obj);
        scope.user = obj;
        return obj;
      });  
  }
})();