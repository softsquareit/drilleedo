





var GoogleBarBasic = function() {


    
    
    

    
    var _googleBarBasic = function() {
        if (typeof google == 'undefined') {
            console.warn('Warning - Google Charts library is not loaded.');
            return;
        }

        
        function color_theme(darkColor, lightColor) {
            return document.documentElement.getAttribute('data-color-theme') == 'dark' ? darkColor : lightColor
        }

        
        google.charts.load('current', {
            callback: function () {

                
                drawBar();

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', drawBar);
                    });
                }

                
                var resizeBarBasic;
                window.addEventListener('resize', function() {
                    clearTimeout(resizeBarBasic);
                    resizeBarBasic = setTimeout(function () {
                        drawBar();
                    }, 200);
                });

                
                document.querySelectorAll('[name="main-theme"]').forEach(function(radio) {
                    radio.addEventListener('change', drawBar);
                });
            },
            packages: ['corechart']
        });

        
        function drawBar() {

            
            var bar_chart_element = document.getElementById('google-bar');

            
            var data = google.visualization.arrayToDataTable([
                ['Year', 'Sales', 'Expenses'],
                ['2004',  1000,      400],
                ['2005',  1170,      460],
                ['2006',  660,       1120],
                ['2007',  1030,      540]
            ]);


            
            var options_bar = {
                fontName: 'var(--body-font-family)',
                height: 400,
                fontSize: 12,
                backgroundColor: 'transparent',
                chartArea: {
                    left: '3%',
                    width: '95%',
                    height: 350
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
                    gridlines:{
                        count: 10
                    },
                    minValue: 0
                },
                hAxis: {
                    baselineColor: color_theme('#6e6f71', '#9CA3AF'),
                    textStyle: {
                        color: color_theme('#fff', '#333')
                    },
                    gridlines:{
                        color: color_theme('#4d4d51', '#E5E7EB')
                    },
                    minorGridlines: {
                        color: color_theme('#3f4044', '#F3F4F6')
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
                    0: { color: '#ffb980' },
                    1: { color: '#66BB6A' }
                }
            };

            
            var bar = new google.visualization.BarChart(bar_chart_element);
            bar.draw(data, options_bar);

        }
    };


    
    
    

    return {
        init: function() {
            _googleBarBasic();
        }
    }
}();





GoogleBarBasic.init();
