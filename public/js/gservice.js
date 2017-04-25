var headerCtrl = angular.module('headerCtrl', []);
headerCtrl.controller('headerCtrl', function($scope, $location) {


    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
});

var app = angular.module('modelCtrl', ['geolocation', 'gservice']);
app.controller('modelCtrl', function($scope, $log, $http, $rootScope, geolocation, gservice){

  console.log("hi")
    $scope.formData = {};
    var queryBody = {};
 
  $scope.loadData=function(){
        $scope.dataFromMap=gservice.myFormData();
    console.log($scope.dataFromMap)
    }
    

});

var app = angular.module('gservice', [])
    .factory('gservice', function ($rootScope, $http, $location) {
        var googleMapService = {};
        googleMapService.myFormData = "";
        googleMapService.clickLat = 0;
        googleMapService.clickLong = 0;

        var locations = [];

        var lastMarker;
        var currentSelectedMarker;


        var selectedLat = -6.493;
        var selectedLong = -106.809;

        googleMapService.refresh = function (latitude, longitude, filteredResults) {

            locations = [];

            selectedLat = latitude;
            selectedLong = longitude;

            if (filteredResults) {
                console.log("filteredResults");
                console.log(filteredResults)
                locations = convertToMapPoints(filteredResults);

                initialize(latitude, longitude, true);
            } else {

                $http.get('/routes').success(function (response) {

                    locations = convertToMapPoints(response);

                    initialize(latitude, longitude, false);
                }).error(function () {});
            }
        };

        var convertToMapPoints = function (response) {

            var locations = [];

            for (var i = 0; i < response.length; i++) {
                var user = response[i];

                var contentString = '<div style="width:500px; height:270px; color:#337ab7;"><p><b>Full name</b>: ' + user.username + '<br><b>Age</b>: ' + user.age + '<br>' +
                    '<b>Gender</b>: ' + user.gender + '<br><b>Occupation</b>: ' + user.favlang + '</p></div>';

                locations.push(new Location(
                    new google.maps.LatLng(user.location[1], user.location[0]),
                    new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 900
                    }),
                    user.username,
                    user.age,
                    user.favlang
                ))
            }

            return locations;
        };


        var Location = function (latlon, message, username, gender, age, favlang) {
            this.latlon = latlon;
            this.message = message;
            this.username = username;
            this.gender = gender;
            this.age = age;
            this.favlang = favlang
        };


        var initialize = function (latitude, longitude, filter) {

            var myLatLng = {
                lat: selectedLat,
                lng: selectedLong
            };

            if (!map) {


                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 2,
                    center: myLatLng
                });
            }


            if (filter) {
            icon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
                
//                icon = "http://downloadicons.net/sites/default/files/chemist-icon-70335.png";
//                icon = "https://image.flaticon.com/icons/png/128/33/33911.png";
                
            } else {
                icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
            }

            locations.forEach(function (n, i) {
                var marker = new google.maps.Marker({
                    position: n.latlon,
                    map: map,
//                    title: "Big Map",
                    icon: icon,
                });

                google.maps.event.addListener(marker, 'click', function (e) {

                    currentSelectedMarker = n;
                    //                    n.message.open(map, marker);
                    console.log(n);
                    googleMapService.myFormData = function(){
                        return n;
                    };
                    //redirect to the information html
                                         $rootScope.$apply(function(){
                    $location.path("/information/");
                    console.log($location.url());
                        })

                });
            });
            var initialLocation = new google.maps.LatLng(latitude, longitude);
            var marker = new google.maps.Marker({
                position: initialLocation,
                animation: google.maps.Animation.BOUNCE,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });
            lastMarker = marker;
            map.panTo(new google.maps.LatLng(latitude, longitude));
            google.maps.event.addListener(map, 'click', function (e) {
                var marker = new google.maps.Marker({
                    position: e.latLng,
                    animation: google.maps.Animation.BOUNCE,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                });
                if (lastMarker) {
                    lastMarker.setMap(null);
                }

                lastMarker = marker;
                map.panTo(marker.position);

                googleMapService.clickLat = marker.getPosition().lat();
                googleMapService.clickLong = marker.getPosition().lng();
                $rootScope.$broadcast("clicked");
            });
        };

        google.maps.event.addDomListener(window, 'load',
            googleMapService.refresh(selectedLat, selectedLong));
        return googleMapService;
    });