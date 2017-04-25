var app = angular.module("requestsModule", []);

app.service("reqService", function($http) {
  this.getData = function () {
		return $http.get("http://localhost:8080/api/");
	}
	this.postData = function (data) {
		return $http.post("http://localhost:8080/api/", data);
	}
	this.delData = function (id) {
		return $http.delete("http://localhost:8080/api/" + id)
	}
    this.delComment = function(id, index) {
        return $http.delete("http://localhost:8080/api/" + id + "?index=" + index);
    };
	this.datadone = function (id, data) {
		var str = "?";
        for(key in data) {
            str += key;
            str += "=";
            str += data[key];
            str += "&"
        }
		return $http.put("http://localhost:8080/api/" + id + str);
	}
});

//app.filter("sort", function() {
//    return function(input) {
//        var output = [];
//        input.sort(function(a, b) {
//            return b.totalvote - a.totalvote
//        })
//        output = input;
//        return output
//    }
//})