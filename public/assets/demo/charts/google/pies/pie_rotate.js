





var GooglePieRotate = function() {


    
    
    

    
    var _googlePieRotate = function() {
        if (typeof google == 'undefined') {
            console.warn('Warning - Google Charts library is not loaded.');
            return;
        }

        
        function color_theme(darkColor, lightColor) {
            return document.documentElement.getAttribute('data-color-theme') == 'dark' ? darkColor : lightColor
        }

        
        google.charts.load('current', {
            callback: function () {

                
                drawPieRotated();

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', drawPieRotated);
                    });
                }

                
                var resizePieRotate;
                window.addEventListener('resize', function() {
                    clearTimeout(resizePieRotate);
                    resizePieRotate = setTimeout(function () {
                        drawPieRotated();
                    }, 200);
                });

                
                document.querySelectorAll('[name="main-theme"]').forEach(function(radio) {
                    radio.addEventListener('change', drawPieRotated);
                });
            },
            packages: ['corechart']
        });

        
        function drawPieRotated() {

            
            var pie_rotate_element = document.getElementById('google-pie-rotate');

            
            var data = google.visualization.arrayToDataTable([
                ['Task', 'Hours per Day'],
                ['Work',     11],
                ['Eat',      2],
                ['Commute',  2],
                ['Watch TV', 2],
                ['Sleep',    7]
            ]);

            
            var options_pie_rotate = {
                fontName: 'var(--body-font-family)',
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

            
            var pie_rotate = new google.visualization.PieChart(pie_rotate_element);
            pie_rotate.draw(data, options_pie_rotate);
        }
    };


    
    
    

    return {
        init: function() {
            _googlePieRotate();
        }
    }
}();





GooglePieRotate.init();
