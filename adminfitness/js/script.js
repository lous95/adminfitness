/// <reference path="angular.min.js" />

// create module and the create controller and attach(register) the controllers to the module
var myAdminFitnessApp = angular
  .module("myModule", ["ui.router"])
  /** */
  .config(function ($stateProvider) {
    $stateProvider
      .state("/ShowUsers", {
        url: "/ShowUsers",
        templateUrl: "../Pages/table.html",
      })
      .state("/UserInfo", {
        url: "/UserInfo",
        templateUrl: "../Pages/user.html",
      })
      .state("/register", {
        url: "/register",
        templateUrl: "../Pages/register.html",
      });
  }) /**adding factory to the module to pass data between controllers */
  .factory("myFactory", function () {
    var savedData = {};
    function set(data) {
      savedData = data;
    }
    function get() {
      return savedData;
    }
    return {
      set: set,
      get: get,
    };
  })
  /*.directive("registerUser", function () {
    return {
        link: function ($scope, element) {
            console.log(element);
            element.bind('blur', function () {
                console.log("aaa");
                var emailInput = element.val();
                var flag = false;
                $scope.registeredUsers.forEach(element => {
                    if (emailInput === element.email) {
                        flag = true;
                        console.log(emailInput);
                        return;
                    }
                });
                $scope.invalid = flag;
                console.log($scope.invalid);
            });
        }
    }
})*/
  .controller("myCtrl", function ($location) {
    $location.path("/ShowUsers");
  })
  .controller("myController", [
    "$scope",
    "$http",
    "$location",
    "myFactory",
    function ($scope, $http, $location, myFactory) {
      $scope.sortColumn = "name";
      $scope.employees = [];
      $http({
        method: "GET",
        url: "https://jsonplaceholder.typicode.com/users",
      }).then(
        function successCallback(response) {
          $scope.employees = response.data;
        },
        function errorCallback(response) {}
      );

      $scope.showInfo = function (item) {
        $location.path("/UserInfo");
        myFactory.set(item);
      };

      $scope.changePath = function () {
        $location.path("/register");
        myFactory.set($scope.employees);
      };
    },
  ])
  .controller("showUserController", function ($scope, myFactory) {
    $scope.userInfo = myFactory.get();
  })
  .controller("registerController", function ($scope, $location, myFactory) {
    $scope.registeredUsers = myFactory.get();
    $scope.IsDisabled = true;
    $scope.EnableDisable = function () {
      //If TextBox is empty or email already exists, the Button will be disabled.
      const emailInput = $scope.emailInput;
      const found =
        $scope.registeredUsers.find((el) => el.email === emailInput) ||
        emailInput === "";
      $scope.IsDisabled = !!found;
    };
  });
