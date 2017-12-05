var author = [];

angular.module("RESTClientApp")
    .controller("GraphCtrl", ["$scope", "$http", function($scope, $http) {


        $scope.refresh = function() {
            $http
                .get("/api/v1/books/")
                .then(function(response) {
                    $scope.books = response.data;
                    
                    
                    var booksArray = [];
                    var yearsArray = [];
                    var numbersArray = [];
                    
                    $scope.books.forEach(function(element){
                        if(yearsArray.includes(element.year)){
                            numbersArray[yearsArray.indexOf(element.year)] = numbersArray[yearsArray.indexOf(element.year)] + 1;
                        }else{
                            yearsArray.push(element.year);
                            numbersArray.push(1);
                        }
                    });
                    
                    for(var i=0; i<yearsArray.length; i++){
                        var bookDataGraph = {name:yearsArray[i],y:numbersArray[i]};
                        booksArray.push(bookDataGraph);
                    }
                    
                    console.log(booksArray);
                    

                    Highcharts.setOptions({
                        colors: Highcharts.map(Highcharts.getOptions().colors, function(color) {
                            return {
                                radialGradient: {
                                    cx: 0.5,
                                    cy: 0.3,
                                    r: 0.7
                                },
                                stops: [
                                    [0, color],
                                    [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                                ]
                            };
                        })
                    });

                    // Build the chart
                    Highcharts.chart('container', {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: 'Books per year'
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    },
                                    connectorColor: 'silver'
                                }
                            }
                        },
                        series: [{
                            name: 'Percentage of books',
                            data: booksArray
                        }]
                    });

                });
        };

        $scope.refresh();

    }]);
