var app = angular.module("app.signin", ["ngRoute", "authModule", "tokenModule"]);

app.config(function($routeProvider) {
  $routeProvider.when("/signin", {
    templateUrl: "/views/signin.html",
    controller: "signinCtrl"
  });
});

app.controller("signinCtrl", function($scope, authService, $location, tokenService, privService) {
  $scope.userinput = {};
  $scope.signin = function() {
    authService.postSignin($scope.userinput).then(function(response) {
      tokenService.setToken(response.data.token);
      privService.setPriv(response.data.priv);
      $location.path("/community");
    }, function(response) {
      console.log(response.status);
    });
  }
});
