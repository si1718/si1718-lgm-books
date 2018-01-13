var author = [];

angular.module("RESTClientApp")
    .controller("GraphCtrl", ["$scope", "$http", function($scope, $http) {

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

        $scope.refresh = function() {
            $http
                .get("/api/v1/books")
                .then(function(response) {
                    $scope.books = response.data;


                    var booksArray = [];
                    var yearsArray = [];
                    var numbersArray = [];

                    $scope.books.forEach(function(element) {
                        if (yearsArray.includes(element.year)) {
                            numbersArray[yearsArray.indexOf(element.year)] = numbersArray[yearsArray.indexOf(element.year)] + 1;
                        }
                        else {
                            yearsArray.push(element.year);
                            numbersArray.push(1);
                        }
                    });

                    for (var i = 0; i < yearsArray.length; i++) {
                        var bookDataGraph = { name: yearsArray[i], y: numbersArray[i] };
                        booksArray.push(bookDataGraph);
                    }

                    // Build the chart
                    Highcharts.chart('books-chart', {
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

        $scope.refresh1 = function() {
            $http
                .get("/api/v1/date")
                .then(function(response) {
                    $scope.date = response.data;


                    var dateArray = [];
                    var businessArray = [];
                    var scienceArray = [];
                    var novaArray = [];

                    $scope.date.forEach(function(element) {

                        var i = 0;

                        for (var property in element) {

                            if (i === 1) {

                                dateArray.push(property);
                                
                                novaArray.push(element[property].nova);
                                scienceArray.push(element[property].science);
                                businessArray.push(element[property].business);
                                
                            }

                            i++;
                        }

                    });

                   
                    Highcharts.chart('dates-chart', {
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: 'Keywords appearence by date'
                        },
                        /*subtitle: {
                            text: 'Source: WorldClimate.com'
                        },*/
                        xAxis: {
                            categories: dateArray
                        },
                        yAxis: {
                            title: {
                                text: 'Number of appearences'
                            },
                            labels: {
                                formatter: function() {
                                    return this.value;
                                }
                            }
                        },
                        tooltip: {
                            crosshairs: true,
                            shared: true
                        },
                        plotOptions: {
                            spline: {
                                marker: {
                                    radius: 4,
                                    lineColor: '#666666',
                                    lineWidth: 1
                                }
                            }
                        },
                        series: [{
                            name: 'nova',
                            marker: {
                                symbol: 'circle'
                            },
                            data: novaArray

                        }, {
                            name: 'science',
                            marker: {
                                symbol: 'square'
                            },
                            data: scienceArray
                        }, {
                            name: 'business',
                            marker: {
                                symbol: 'triangle'
                            },
                            data: businessArray
                        }]
                    });
                });
        };
        
        $scope.refresh2 = function() {
            $http
                .get("/api/v1/month")
                .then(function(response) {
                    $scope.date = response.data;


                    var monthArray = [];
                    var businessArray = [];
                    var scienceArray = [];
                    var novaArray = [];

                    $scope.date.forEach(function(element) {

                        var i = 0;

                        for (var property in element) {

                            if (i === 1) {

                                monthArray.push(property);
                                
                                novaArray.push(element[property].nova);
                                scienceArray.push(element[property].science);
                                businessArray.push(element[property].business);
                                
                            }

                            i++;
                        }

                    });

                   
                    Highcharts.chart('months-chart', {
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: 'Keywords appearence by month'
                        },
                        /*subtitle: {
                            text: 'Source: WorldClimate.com'
                        },*/
                        xAxis: {
                            categories: monthArray
                        },
                        yAxis: {
                            title: {
                                text: 'Number of appearences'
                            },
                            labels: {
                                formatter: function() {
                                    return this.value;
                                }
                            }
                        },
                        tooltip: {
                            crosshairs: true,
                            shared: true
                        },
                        plotOptions: {
                            spline: {
                                marker: {
                                    radius: 4,
                                    lineColor: '#666666',
                                    lineWidth: 1
                                }
                            }
                        },
                        series: [{
                            name: 'nova',
                            marker: {
                                symbol: 'circle'
                            },
                            data: novaArray

                        }, {
                            name: 'science',
                            marker: {
                                symbol: 'square'
                            },
                            data: scienceArray
                        }, {
                            name: 'business',
                            marker: {
                                symbol: 'triangle'
                            },
                            data: businessArray
                        }]
                    });
                });
        };

        $scope.refresh();
        $scope.refresh1();
        $scope.refresh2();
        

    }]);
