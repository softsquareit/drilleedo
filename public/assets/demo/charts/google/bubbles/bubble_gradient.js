





var GoogleBubbleGradientChart = function() {


    
    
    

    
    var _googleBubbleGradientChart = function() {
        if (typeof google == 'undefined') {
            console.warn('Warning - Google Charts library is not loaded.');
            return;
        }

        
        function color_theme(darkColor, lightColor) {
            return document.documentElement.getAttribute('data-color-theme') == 'dark' ? darkColor : lightColor
        }

        
        google.charts.load('current', {
            callback: function () {

                
                drawBubbleGradientChart();

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', drawBubbleGradientChart);
                    });
                }

                
                var resizeBubbleGradientChart;
                window.addEventListener('resize', function() {
                    clearTimeout(resizeBubbleGradientChart);
                    resizeBubbleGradientChart = setTimeout(function () {
                        drawBubbleGradientChart();
                    }, 200);
                });

                
                document.querySelectorAll('[name="main-theme"]').forEach(function(radio) {
                    radio.addEventListener('change', drawBubbleGradientChart);
                });
            },
            packages: ['corechart']
        });

        
        function drawBubbleGradientChart() {

            
            var bubble_gradient_element = document.getElementById('google-bubble-gradient');

            
            var data = google.visualization.arrayToDataTable([
                ['ID', 'X', 'Y', 'Temperature'],
                ['',   80,  167,      120],
                ['',   79,  136,      130],
                ['',   78,  184,      50],
                ['',   72,  278,      230],
                ['',   81,  200,      210],
                ['',   72,  170,      100],
                ['',   68,  477,      80]
            ]);

            
            var options = {
                fontName: 'var(--body-font-family)',
                height: 450,
                fontSize: 12,
                backgroundColor: 'transparent',
                colors: [
                    '#5ab1ef','#d87a80'
                ],
                chartArea: {
                    left: '4%',
                    width: '95%',
                    height: 400
                },
                tooltip: {
                    textStyle: {
                        fontSize: 14
                    }
                },
                vAxis: {
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
                    },
                    baselineColor: color_theme('#6e6f71', '#9CA3AF'),
                    gridlines:{
                        color: color_theme('#4d4d51', '#E5E7EB'),
                        count: 10
                    },
                    minorGridlines: {
                        color: color_theme('#3f4044', '#F3F4F6')
                    }
                },
                bubble: {
                  textStyle: {
                    fontSize: 12
                  },
                  opacity: 1,
                  stroke: 'transparent'
                },
                colorAxis: {
                    legend: {
                        textStyle: {
                            color: color_theme('#fff', '#333')
                        }
                    }
                }
            };

            
            var gradient_bubble = new google.visualization.BubbleChart(bubble_gradient_element);
            gradient_bubble.draw(data, options);
        }
    };


    
    
    

    return {
        init: function() {
            _googleBubbleGradientChart();
        }
    }
}();





GoogleBubbleGradientChart.init();
