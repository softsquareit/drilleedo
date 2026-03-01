





var GoogleDonutRotated = function() {


    
    
    

    
    var _googleDonutRotated = function() {
        if (typeof google == 'undefined') {
            console.warn('Warning - Google Charts library is not loaded.');
            return;
        }

        
        function color_theme(darkColor, lightColor) {
            return document.documentElement.getAttribute('data-color-theme') == 'dark' ? darkColor : lightColor
        }

        
        google.charts.load('current', {
            callback: function () {

                
                drawDonutRotated();

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', drawDonutRotated);
                    });
                }

                
                var resizeDonutRotated;
                window.addEventListener('resize', function() {
                    clearTimeout(resizeDonutRotated);
                    resizeDonutRotated = setTimeout(function () {
                        drawDonutRotated();
                    }, 200);
                });

                
                document.querySelectorAll('[name="main-theme"]').forEach(function(radio) {
                    radio.addEventListener('change', drawDonutRotated);
                });
            },
            packages: ['corechart']
        });

        
        function drawDonutRotated() {

            
            var donut_rotated_element = document.getElementById('google-donut-rotate');

            
            var data = google.visualization.arrayToDataTable([
                ['Task', 'Hours per Day'],
                ['Work',     11],
                ['Eat',      2],
                ['Commute',  2],
                ['Watch TV', 2],
                ['Sleep',    7]
            ]);

            
            var options_donut_rotate = {
                fontName: 'var(--body-font-family)',
                pieHole: 0.55,
                pieStartAngle: 180,
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
                }
            };

            
            var donut_rotate = new google.visualization.PieChart(donut_rotated_element);
            donut_rotate.draw(data, options_donut_rotate);
        }
    };


    
    
    

    return {
        init: function() {
            _googleDonutRotated();
        }
    }
}();





GoogleDonutRotated.init();
