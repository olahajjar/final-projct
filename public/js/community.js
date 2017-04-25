var app = angular.module("app.community", ["ngRoute", "requestsModule","privModule"]);

app.config(function($routeProvider) {
  $routeProvider.when("/community", {
    templateUrl: "/views/community.html",
    controller: "communityCtrl"
  });
});

app.controller("communityCtrl", function($scope, reqService,privService) {
  $scope.showTitle = [];
    $scope.editBtn = [];
    $scope.items = [];
    $scope.showComments = [];
    $scope.showDesc = [];
    $scope.priv = privService.getPriv();
    
    $scope.loadData = function () {
		reqService.getData().then(function (response) {
			$scope.items = response.data.data;
            for (var i = 0; i < $scope.items.length; i++) {
                $scope.showTitle[i] = true;
                $scope.editBtn[i] = true;
                $scope.showDesc[i] = true;
            };
		}, function (error) {
			alert("error status: " + error.status);
		})
	};
	
    //vote up
     $scope.upvote = function (id, upVote) {
        upVote++;
        var data = {
            upvote: upVote
        }
        reqService.datadone(id, data).then($scope.loadData);
    };
    
	//vote down
    $scope.downvote = function (id, downVote) {
        downVote++
        var data = {
            downvote: downVote
        }
        reqService.datadone(id, data).then($scope.loadData);
    };
    
    //show comments
    $scope.commentsBtn = function (index) {
        $scope.showComments[index] = !$scope.showComments[index];
    };
    
    //add comment
    $scope.addComment = function (id, comment) {
        var data = {
            comments: comment
        }
        reqService.datadone(id, data).then($scope.loadData);
    };
    
    //show add button
    $scope.addBtn = true;

    //show add issue
    $scope.showIssueField = function () {
        $scope.addIssueFields = !$scope.addIssueFields;
        $scope.addBtn = !$scope.addBtn
    }
    
	//add new issue
	$scope.addNewIssue = function () {
		var data = {
			title: $scope.title,
			description: $scope.desc,
			upvote: 0,
            downvote: 0
		}
		reqService.postData(data).then($scope.loadData);
		$scope.title = "";
		$scope.desc = "";
        $scope.addIssueFields = !$scope.addIssueFields;
        $scope.addBtn = !$scope.addBtn;
	}

	//delete issue
	$scope.delIssue = function (id) {
		reqService.delData(id).then($scope.loadData);
	};

    $scope.titleInput = [];
    $scope.okBtn = [];
    $scope.descInput = [];
	
    //show edit
    $scope.showEdit = function (index) {
        $scope.showTitle[index] = !$scope.showTitle[index];
        $scope.editBtn[index] = !$scope.editBtn[index];
        $scope.titleInput[index] = !$scope.titleInput[index];
        $scope.okBtn[index] = !$scope.okBtn[index];
        $scope.showDesc[index] = !$scope.showDesc[index];
        $scope.descInput[index] = !$scope.descInput[index];
    }
    
	//edit issue
	$scope.editIssue = function (index, id, title, desc) {
		var newdata = {
			title: title,
            description: desc
		}
		reqService.datadone(id, newdata).then($scope.loadData);
		$scope.showTitle[index] = !$scope.showTitle[index];
        $scope.editBtn[index] = !$scope.editBtn[index];
        $scope.titleInput[index] = !$scope.titleInput[index];
        $scope.okBtn[index] = !$scope.okBtn[index];
        $scope.showDesc[index] = !$scope.showDesc[index]
        $scope.descInput[index] = !$scope.descInput[index]
	}
    
    //delete comment
    $scope.delComment = function (id, index) {
        reqService.delComment(id, index).then($scope.loadData)
    }
    $scope.sort = function (item) {
        return item.upvote + item.downvote;
    }
});