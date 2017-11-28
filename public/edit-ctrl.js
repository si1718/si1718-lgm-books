var author = [];

angular.module("RESTClientApp")
    .controller("EditCtrl", ["$scope","$http","$routeParams","$location", function($scope,$http,$routeParams,$location){
        
        $scope.idBook = $routeParams.idBooks;
        
        console.log("EditCtrl initialized for book "+ $scope.idBook);
        $http
                .get("/api/v1/books/"+$scope.idBook)
                .then(function (response){
                    $scope.updatedBook = response.data;
                });
                
        $scope.updateBook = function(){
            
            delete $scope.updatedBook._id;
            
            if(($scope.updatedBook.author instanceof String)==true){
                
                author = $scope.updatedBook.author.split(",");
                if(author.length>1){
                    $scope.updatedBook.author = author;
                }else{
                    author[0] = $scope.updatedBook.author;
                    $scope.updatedBook.author = author;
                }
            }else{
                author = $scope.updatedBook.author;
            }
            
            $http
                .put("/api/v1/books/"+$scope.idBook,$scope.updatedBook)
                .then(function (response){
                    console.log("Updated");
                    $location.path("/");
                }, function(error) {
            iziToast.error({
                icon: "fa fa-times",
                title: 'More data needed',
                position: "topRight",
                message: error.data
            });
        });
        };
        
        $scope.go = function(path){
            $location.path(path);
        }
}]);