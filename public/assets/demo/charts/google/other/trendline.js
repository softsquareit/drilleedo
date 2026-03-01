





var GoogleTrendline = function() {


    
    
    

    
    var _googleTrendline = function() {
        if (typeof google == 'undefined') {
            console.warn('Warning - Google Charts library is not loaded.');
            return;
        }

        
        function color_theme(darkColor, lightColor) {
            return document.documentElement.getAttribute('data-color-theme') == 'dark' ? darkColor : lightColor
        }

        
        google.charts.load('current', {
            callback: function () {

                
                drawTrendline();

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', drawTrendline);
                    });
                }

                
                var resizeTrendline;
                window.addEventListener('resize', function() {
                    clearTimeout(resizeTrendline);
                    resizeTrendline = setTimeout(function () {
                        drawTrendline();
                    }, 200);
                });

                
                document.querySelectorAll('[name="main-theme"]').forEach(function(radio) {
                    radio.addEventListener('change', drawTrendline);
                });
            },
            packages: ['corechart']
        });

        
        function drawTrendline() {

            
            var trendline_element = document.getElementById('google-trendline');

            
            var data = google.visualization.arrayToDataTable([
                ['Week', 'Bugs', 'Tests'],
                [1, 175, 10],
                [2, 159, 20],
                [3, 126, 35],
                [4, 129, 40],
                [5, 108, 60],
                [6, 92, 70],
                [7, 55, 72],
                [8, 50, 97]
            ]);

            
            var options = {
                fontName: 'var(--body-font-family)',
                height: 400,
                curveType: 'function',
                fontSize: 12,
                backgroundColor: 'transparent',
                colors: [
                    '#2ed88f','#ffb980'
                ],
                chartArea: {
                    left: '5%',
                    width: '94%',
                    height: 350
                },
                hAxis: {
                    textStyle: {
                        color: color_theme('#fff', '#333')
                    },
                    baselineColor: color_theme('#6e6f71', '#9CA3AF'),
                    gridlines:{
                        color: color_theme('#4d4d51', '#E5E7EB'),
                        count: 10
                    },
                    minorGridlines: {
                        color: color_theme('#3f4044', '#F3F4F6')
                    },
                    format: '#',
                    viewWindow: {
                        min: 0,
                        max: 9
                    }
                },
                vAxis: {
                    title: 'Bugs and tests',
                    titleTextStyle: {
                        fontSize: 14,
                        italic: false,
                        color: color_theme('#fff', '#333')
                    },
                    textStyle: {
                        color: color_theme('#fff', '#333')
                    },
                    baselineColor: color_theme('#6e6f71', '#9CA3AF'),
                    gridlines:{
                        color: color_theme('#4d4d51', '#E5E7EB'),
                        count: 10
                    },
                    minorGridlines: {
                        color: color_theme('#3f4044', '#F3F4F6')
                    },
                    minValue: 0
                },
                trendlines: {
                    0: {
                        labelInLegend: 'Bug line',
                        visibleInLegend: true,
                    },
                    1: {
                        labelInLegend: 'Test line',
                        visibleInLegend: true,
                    }
                },
                legend: {
                    position: 'top',
                    alignment: 'end',
                    textStyle: {
                        color: color_theme('#fff', '#333')
                    }
                }
            };

            
            var trendline = new google.visualization.ColumnChart(trendline_element);
            trendline.draw(data, options);
        }
    };


    
    
    

    return {
        init: function() {
            _googleTrendline();
        }
    }
}();





GoogleTrendline.init();
