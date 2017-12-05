var app = angular.module("RESTClientApp",["ngRoute"])
            .config(function($routeProvider){
                $routeProvider
                    .when("/",{
                        templateUrl: "list.html",
                        controller:"ListCtrl"
                    }).when("/book/:idBooks",{
                        templateUrl: "edit.html",
                        controller:"EditCtrl"
                    }).when("/graph",{
                        templateUrl: "graph.html",
                        controller:"GraphCtrl"
                    });
                
                console.log("App Initialized"); 
            });