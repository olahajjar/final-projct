var app = angular.module("app.signup", ["ngRoute", "authModule"]);

app.config(function($routeProvider) {
  $routeProvider.when("/signup", {
    templateUrl: "/views/signup.html",
    controller: "signupCtrl"
  });
});

app.controller("signupCtrl", function($scope, authService, $location) {
  $scope.userinput = {};
  $scope.signup = function() {
    authService.postSignup($scope.userinput).then(function(response) {
      alert("You have signed up for an account");
      $location.path("/signin");
    }, function(response) {
      console.log(response.status);
    });
  }
});
