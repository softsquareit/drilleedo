





var GoogleDonutBasic = function() {


    
    
    

    
    var _googleDonutBasic = function() {
        if (typeof google == 'undefined') {
            console.warn('Warning - Google Charts library is not loaded.');
            return;
        }

        
        function color_theme(darkColor, lightColor) {
            return document.documentElement.getAttribute('data-color-theme') == 'dark' ? darkColor : lightColor
        }

        
        google.charts.load('current', {
            callback: function () {

                
                drawDonut();

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', drawDonut);
                    });
                }

                
                var resizeDonutBasic;
                window.addEventListener('resize', function() {
                    clearTimeout(resizeDonutBasic);
                    resizeDonutBasic = setTimeout(function () {
                        drawDonut();
                    }, 200);
                });

                
                document.querySelectorAll('[name="main-theme"]').forEach(function(radio) {
                    radio.addEventListener('change', drawDonut);
                });
            },
            packages: ['corechart']
        });

        
        function drawDonut() {

            
            var donut_chart_element = document.getElementById('google-donut');

            
            var data = google.visualization.arrayToDataTable([
                ['Task', 'Hours per Day'],
                ['Work',     11],
                ['Eat',      2],
                ['Commute',  2],
                ['Watch TV', 2],
                ['Sleep',    7]
            ]);

            
            var options_donut = {
                fontName: 'var(--body-font-family)',
                pieHole: 0.55,
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
            
            
            var donut = new google.visualization.PieChart(donut_chart_element);
            donut.draw(data, options_donut);
        }
    };


    
    
    

    return {
        init: function() {
            _googleDonutBasic();
        }
    }
}();





GoogleDonutBasic.init();
