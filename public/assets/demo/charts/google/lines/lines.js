





var GoogleLineBasic = function() {


    
    
    

    
    var _googleLineBasic = function() {
        if (typeof google == 'undefined') {
            console.warn('Warning - Google Charts library is not loaded.');
            return;
        }

        
        function color_theme(darkColor, lightColor) {
            return document.documentElement.getAttribute('data-color-theme') == 'dark' ? darkColor : lightColor
        }

        
        google.charts.load('current', {
            callback: function () {

                
                drawLineChart();

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', drawLineChart);
                    });
                }

                
                var resizeLineBasic;
                window.addEventListener('resize', function() {
                    clearTimeout(resizeLineBasic);
                    resizeLineBasic = setTimeout(function () {
                        drawLineChart();
                    }, 200);
                });

                
                document.querySelectorAll('[name="main-theme"]').forEach(function(radio) {
                    radio.addEventListener('change', drawLineChart);
                });
            },
            packages: ['corechart']
        });

        
        function drawLineChart() {

            
            var line_chart_element = document.getElementById('google-line');

            
            var data = google.visualization.arrayToDataTable([
                ['Year', 'Sales', 'Expenses'],
                ['2004',  1000,      400],
                ['2005',  1170,      460],
                ['2006',  660,       1120],
                ['2007',  1030,      540]
            ]);

            
            var options = {
                fontName: 'var(--body-font-family)',
                height: 400,
                fontSize: 12,
                chartArea: {
                    left: '5%',
                    width: '94%',
                    height: 350
                },
                pointSize: 7,
                curveType: 'function',
                backgroundColor: 'transparent',
                tooltip: {
                    textStyle: {
                        fontSize: 14
                    }
                },
                vAxis: {
                    title: 'Sales and Expenses',
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
                hAxis: {
                    textStyle: {
                        color: color_theme('#fff', '#333')
                    }
                },
                legend: {
                    position: 'top',
                    alignment: 'center',
                    textStyle: {
                        color: color_theme('#fff', '#333')
                    }
                },
                series: {
                    0: { color: '#EF5350' },
                    1: { color: '#66BB6A' }
                }
            };

            
            var line_chart = new google.visualization.LineChart(line_chart_element);
            line_chart.draw(data, options);
        }
    };


    
    
    

    return {
        init: function() {
            _googleLineBasic();
        }
    }
}();





GoogleLineBasic.init();

