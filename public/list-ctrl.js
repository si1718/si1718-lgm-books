var author = [];

angular.module("RESTClientApp")
    .controller("ListCtrl", ["$scope","$http","$httpParamSerializer", function($scope,$http,$httpParamSerializer){
            
            
            $scope.refresh = function(){
                var querySerial = $httpParamSerializer($scope.newBook);
                $http
                .get("/api/v1/books/?" +  querySerial)
                .then(function(response){
                    $scope.books = response.data;
                });
            };
            
            
            $scope.addBook = function(){
                
                if($scope.newBook.author instanceof String){
                    author = $scope.newBook.author.split(",");
                    if(author.length>1){
                        $scope.newBook.author = author;
                    }else{
                        author[0] = $scope.newBook.author;
                        $scope.newBook.author = author;
                    }
                }
                    $http
                    .post("/api/v1/books",$scope.newBook)
                    .then(function (response){
                        $scope.newBook.title = "";
                        $scope.newBook.author = "";
                        $scope.newBook.publisher = "";
                        $scope.newBook.year = "";
                        $scope.newBook.idBooks = "";
                        $scope.refresh();
                    }, function(error) {
            iziToast.error({
                icon: "fa fa-times",
                title: 'More data needed',
                position: "topRight",
                message: error.data
            });
        });
            };
            
            
            
            $scope.deleteBook = function(idBooks){
                $http
                .delete("/api/v1/books/"+idBooks)
                .then(function (response){
                    $scope.refresh();
                });
            };
            
            $scope.refresh();
            
    }]);