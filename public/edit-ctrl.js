var author = [];

angular.module("RESTClientApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location) {

        $scope.idBook = $routeParams.idBooks;
        var arrayResearchers = [];

        console.log("EditCtrl initialized for book " + $scope.idBook);
        $http
            .get("/api/v1/books/" + $scope.idBook)
            .then(function(response) {
                $scope.updatedBook = response.data;
            });

        $scope.updateBook = function() {

            delete $scope.updatedBook._id;

            if (typeof($scope.updatedBook.author)==='string') {

                author = $scope.updatedBook.author.split(",");
                if (author.length > 1) {
                    $scope.updatedBook.author = author;
                }
                else {
                    author[0] = $scope.updatedBook.author;
                    $scope.updatedBook.author = author;
                }
            }
            else {
                author = $scope.updatedBook.author;
            }

            $http
                .put("/api/v1/books/" + $scope.idBook, $scope.updatedBook)
                .then(function(response) {
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

        $scope.validateChapters = function() {
            var chapters = {
                idChapter: null,
                titleChapter: null,
                pagesChapter: null
            }

            var url = "https://si1718-npg-chapters.herokuapp.com/api/v1/chapters/?book=" + $scope.updatedBook.idBooks;

            $http({
                url: url,
                method: "GET"
            }).then(function success(res) {
                if (res.data.length > 0) {
                    iziToast.success({
                        icon: "fa fa-times",
                        title: 'Success',
                        position: "topRight"
                    });

                    chapters["idChapter"] = "https://si1718-npg-chapters.herokuapp.com/api/v1/chapters/" + res.data[0]["idChapter"];
                    chapters["titleChapter"] = res.data[0]["name"];
                    chapters["pagesChapter"] = res.data[0]["pages"];

                    $scope.updatedBook.chapters = chapters;

                    document.getElementById('validate-chapter').setAttribute('disabled', true);
                }else{
                    iziToast.error({
                        icon: "fa fa-times",
                        title: 'No chapters found with that ISBN',
                        position: "topRight"
                    });
                }

            }, function error(res) {
                if (res.status == 404) {
                    iziToast.error({
                        icon: "fa fa-times",
                        title: 'No chapters found with that ISBN',
                        position: "topRight"
                    });
                }
            });
        };
        
        $scope.addValidationAuthors = function(){
            if (typeof($scope.updatedBook.author)==='string') {
                author = $scope.updatedBook.author.split(",");
                if (author.length > 1) {
                    $scope.authors = author;
                }
                else {
                    author[0] = $scope.updatedBook.author;
                    $scope.authors = author;
                }
            }
            else {
                $scope.authors = $scope.updatedBook.author;
            }
            
            
        };
        
        $scope.validateAuthor = function(author,index){
            var researcher = {
                nameAuthor: null,
                viewAuthor: null,
                idAuthor: null,
                idAuthorGroup: null
            }
            

            var url = "https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/?search=" + author;

            $http({
                url: url,
                method: "GET"
            }).then(function success(res) {
                if (res.data.length > 0) {
                    iziToast.success({
                        icon: "fa fa-times",
                        title: 'Success',
                        position: "topRight"
                    });
                    
                    researcher["nameAuthor"] = res.data[0]["name"];
                    researcher["viewAuthor"] = res.data[0]["viewURL"];
                    researcher["idAuthor"] = res.data[0]["idResearcher"];
                    researcher["idAuthorGroup"] = res.data[0]["idGroup"];
                    
                    $scope.authors[index]=researcher["viewAuthor"];
                    arrayResearchers.push(researcher);
                    $scope.updatedBook.researcher = arrayResearchers;

                    document.getElementById(index.toString()).setAttribute('disabled', true);
                }else{
                    iziToast.error({
                        icon: "fa fa-times",
                        title: 'No author found by that name',
                        position: "topRight"
                    });
                }

            }, function error(res) {
                if (res.status == 404) {
                    iziToast.error({
                        icon: "fa fa-times",
                        title: 'No author found by that name',
                        position: "topRight"
                    });
                }
            });
        }

        $scope.go = function(path) {
            $location.path(path);
        };


    }]);
