





var GoogleDiffChart = function() {


    
    
    

    
    var _googleDiffChart = function() {
        if (typeof google == 'undefined') {
            console.warn('Warning - Google Charts library is not loaded.');
            return;
        }

        
        function color_theme(darkColor, lightColor) {
            return document.documentElement.getAttribute('data-color-theme') == 'dark' ? darkColor : lightColor
        }

        
        google.charts.load('current', {
            callback: function () {

                
                drawDiff();

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', drawDiff);
                    });
                }

                
                var resizeDiffChart;
                window.addEventListener('resize', function() {
                    clearTimeout(resizeDiffChart);
                    resizeDiffChart = setTimeout(function () {
                        drawDiff();
                    }, 200);
                });

                
                document.querySelectorAll('[name="main-theme"]').forEach(function(radio) {
                    radio.addEventListener('change', drawDiff);
                });
            },
            packages: ['corechart']
        });

        
        function drawDiff() {

            
            var diff_chart_element = document.getElementById('google-diff');

            
            var oldData = google.visualization.arrayToDataTable([
                ['Name', 'Popularity'],
                ['Cesar', 425],
                ['Rachel', 420],
                ['Patrick', 290],
                ['Eric', 620],
                ['Eugene', 520],
                ['John', 460],
                ['Greg', 420],
                ['Matt', 410]
            ]);

            
            var newData = google.visualization.arrayToDataTable([
                ['Name', 'Popularity'],
                ['Cesar', 307],
                ['Rachel', 360],
                ['Patrick', 200],
                ['Eric', 550],
                ['Eugene', 460],
                ['John', 320],
                ['Greg', 390],
                ['Matt', 360]
            ]);

            
            var options = {
                fontName: 'var(--body-font-family)',
                height: 400,
                fontSize: 12,
                backgroundColor: 'transparent',
                chartArea: {
                    left: '5%',
                    width: '94%',
                    height: 350
                },
                colors: ['#2ed88f'],
                tooltip: {
                    textStyle: {
                        fontSize: 14
                    }
                },
                vAxis: {
                    title: 'Popularity',
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
                diff: {
                    oldData: {
                        color: color_theme('#3f4044', '#F3F4F6')
                    }
                }
            };

            
            var diff = new google.visualization.ColumnChart(diff_chart_element);

            
            var diffData = diff.computeDiff(oldData, newData);

            
            diff.draw(diffData, options);
        }
    };


    
    
    

    return {
        init: function() {
            _googleDiffChart();
        }
    }
}();





GoogleDiffChart.init();
