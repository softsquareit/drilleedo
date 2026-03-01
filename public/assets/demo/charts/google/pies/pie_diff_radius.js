





var GooglePieDiff = function() {


    
    
    

    
    var _googlePieDiff = function() {
        if (typeof google == 'undefined') {
            console.warn('Warning - Google Charts library is not loaded.');
            return;
        }

        
        function color_theme(darkColor, lightColor) {
            return document.documentElement.getAttribute('data-color-theme') == 'dark' ? darkColor : lightColor
        }

        
        google.charts.load('current', {
            callback: function () {

                
                drawPieDiff();

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', drawPieDiff);
                    });
                }

                
                var resizePieDiff;
                window.addEventListener('resize', function() {
                    clearTimeout(resizePieDiff);
                    resizePieDiff = setTimeout(function () {
                        drawPieDiff();
                    }, 200);
                });

                
                document.querySelectorAll('[name="main-theme"]').forEach(function(radio) {
                    radio.addEventListener('change', drawPieDiff);
                });
            },
            packages: ['corechart']
        });

        
        function drawPieDiff() {

            
            var pie_diff_element = document.getElementById('google-pie-diff-radius');

            
            var oldData = google.visualization.arrayToDataTable([
                ['Major', 'Degrees'],
                ['Business', 256070], ['Education', 108034],
                ['Social Sciences & History', 127101], ['Health', 81863],
                ['Psychology', 74194]
            ]);

            
            var newData = google.visualization.arrayToDataTable([
                ['Major', 'Degrees'],
                ['Business', 358293], ['Education', 101265],
                ['Social Sciences & History', 172780], ['Health', 129634],
                ['Psychology', 97216]
            ]);

            
            var options = {
                fontName: 'var(--body-font-family)',
                height: 300,
                width: 500,
                backgroundColor: 'transparent',
                pieSliceBorderColor: color_theme('#2c2d32', '#fff'),
                colors: [
                    '#2ec7c9','#b6a2de','#5ab1ef','#ffb980',
                    '#d87a80','#8d98b3','#e5cf0d','#97b552'
                ],
                legend: {
                    textStyle: {
                        color: color_theme('#fff', '#333')
                    }
                },
                chartArea: {
                    left: 50,
                    width: '90%',
                    height: '90%'
                },
                diff: {
                    innerCircle: {
                        radiusFactor: 0.8
                    }
                }
            };

            
            var chartRadius = new google.visualization.PieChart(pie_diff_element);

            
            var diffData = chartRadius.computeDiff(oldData, newData);

            
            chartRadius.draw(diffData, options);
        }
    };


    
    
    

    return {
        init: function() {
            _googlePieDiff();
        }
    }
}();





GooglePieDiff.init();
