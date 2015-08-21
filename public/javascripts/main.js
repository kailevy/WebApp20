(function(){
  //initialize the angular app and inject dependencies.
  var app = angular.module("olinbaja", ['ngRoute']);

  app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider.when('/',{
      templateUrl: '../templates/home.html',
      controller: 'IndexController',
      controllerAs: 'index'
    }).when('/purchases',{
      templateUrl: '../templates/purchasePage.html',
      controller: 'PurchaseController',
      controllerAs: 'purchase'
    });
  }]);

  app.factory('UserService', [function(){
    var user = {
      isLogged: false,
      username: ''
    };
    return user;
  }]);

  app.controller('NavController', ['$scope','$http', 'UserService', function($scope, $http, User){
    $scope.loggedIn = User.isLogged;
  }]);

  app.controller('IndexController', ['$http', function($http){
    $http.get('/session/user');
  }]);

  app.controller('PurchaseController', ['$http', function($http){
    console.log('Purchase Page');
    var page = this;

    this.submitForm = function(){

    };
  }]);
})();