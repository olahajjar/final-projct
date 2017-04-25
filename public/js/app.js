var app = angular.module('myApp', ['addCtrl', 'queryCtrl','modelCtrl', 'headerCtrl', 'geolocation', 'gservice', 'ngRoute','app.community','tokenModule','app.signin','app.signup'])


    .config(function($locationProvider,$routeProvider){

$locationProvider.hashPrefix("");
        $routeProvider.
         when('/contact', {
            controller: '',
            templateUrl: '/views/contact.html'

  
        }).
          when('/home', {
            controller: '',
            templateUrl: '/views/home.html'

  
        }).
//          when('/signin', {
//            controller: '',
//            templateUrl: '/views/signin.html'
//
//  
//        }).
//         when('/signup', {
//            controller: '',
//            templateUrl: '/views/signup.html'
//  
//        }).
        when('/join', {
            controller: 'addCtrl',
            templateUrl: '/views/addForm.html'

  
        }).when('/find', {
            controller: 'queryCtrl',
            templateUrl: '/views/queryForm.html'

        }).when('/information', {
            controller: 'modelCtrl',
            templateUrl: '/views/information.html'
        }).when('/bla', {
            controller: 'queryCtrl',
            templateUrl: '/views/queryForm.html'
        }).otherwise({redirectTo:'/home'})
    });
//ng-controller="headerCtrl"

app.service("AuthSerivce", function($q, $location, tokenService ) {
  this.request = function(config) {
    var token = tokenService.getToken();
    if(token) {
      config.headers = config.headers || {};
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  };

  this.responseError = function(response) {
    if(response.status == 401) {
      alert("Token is no longer valid");
      $location.path("/signin")
    }
    return $q.reject(response);
  };
});

app.config(function($httpProvider) {
  $httpProvider.interceptors.push("AuthSerivce");
})

app.controller("homeCtrl",function($scope,tokenService,$location){
    $scope.logout=function(){
        tokenService.removeToken();
        $location.path("/");
    }
})
