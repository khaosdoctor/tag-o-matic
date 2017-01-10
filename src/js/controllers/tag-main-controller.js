(function () {
  'use strict';

  angular.module('tagModule')
    .controller('tagMainController', tagMainController);

  function tagMainController($scope, $http, $window, $cookies, configFactory) { //Controller for the taglist and imagelist
    $scope.init = () => {
      let User = $cookies.get('User'); //Get user globally
      $scope.photos = []; //Set empty photos
      if(!User) return $window.location.href = "/views/login.html"; //if not set the user then return to login
      $scope.user = JSON.parse(User); //Otherwise parse as json
    };

    $scope.saveTag = (isValid) => { //Save a new tag based on search
      if (isValid) {
        let obj = { user_id: $scope.user.id, tag: $scope.tagSearch.name }; //Creates req object
        
        $http.post(configFactory.endpoints.new_tag, obj)//Calls endpoint
          .then((response) => {
            let code = response.status;
            $scope.searchTag($scope.tagSearch.name); //Calls the search function
            $scope.tagSearch.name = ""; //Cleans the form

            if (code == 201) {
              return recreateUser($cookies, $scope, $http, configFactory); //Reload User object
            } else if (code == 304) {
              return false; //Nothing happened, not modified
            }
          });
      }
    };

    $scope.searchTag = (tagName) => { //Searches for tags
      $scope.photos = {};
      $scope.tag_search_name = ": #" + tagName; //Sets result name
      $scope.tagActive = tagName; //Sets active tag
      $scope.isLoading = true; //Shows preloader
      $http.get(configFactory.endpoints.get_tag + tagName) //Gets instagram info
        .then((response) => {
          $scope.isLoading = false;
          $scope.photos = response.data;
        });
    };

    $scope.removeTag = (tagId) => { //Removes a tag
      $http.delete(configFactory.endpoints.get_tag + $scope.user.id + "/" + tagId) //Removes based on ID
        .then((response) => {
          return recreateUser($cookies, $scope, $http, configFactory); //Reloads the user
        });
    }

  }

  //Recalls API to reload the user endpoint  
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