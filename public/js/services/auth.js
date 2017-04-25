var app = angular.module("authModule", []);

app.service("authService", function($http) {
  this.postSignup = function(data) {
    return $http.post("http://localhost:8080/auth/signup", data);
  };

  this.postSignin = function(data) {
    return $http.post("http://localhost:8080/auth/signin", data);
  };
});
