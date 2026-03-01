





var GooglePie3d = function() {


    
    
    

    
    var _googlePie3d = function() {
        if (typeof google == 'undefined') {
            console.warn('Warning - Google Charts library is not loaded.');
            return;
        }

        
        function color_theme(darkColor, lightColor) {
            return document.documentElement.getAttribute('data-color-theme') == 'dark' ? darkColor : lightColor
        }

        
        google.charts.load('current', {
            callback: function () {

                
                drawPie3d();

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', drawPie3d);
                    });
                }

                
                var resizePie3d;
                window.addEventListener('resize', function() {
                    clearTimeout(resizePie3d);
                    resizePie3d = setTimeout(function () {
                        drawPie3d();
                    }, 200);
                });

                
                document.querySelectorAll('[name="main-theme"]').forEach(function(radio) {
                    radio.addEventListener('change', drawPie3d);
                });
            },
            packages: ['corechart']
        });

        
        function drawPie3d() {

            
            var pie_3d_element = document.getElementById('google-pie-3d');

            
            var data = google.visualization.arrayToDataTable([
                ['Task', 'Hours per Day'],
                ['Work',     11],
                ['Eat',      2],
                ['Commute',  2],
                ['Watch TV', 2],
                ['Sleep',    7]
            ]);

            
            var options_pie_3d = {
                fontName: 'var(--body-font-family)',
                is3D: true,
                height: 300,
                width: 540,
                backgroundColor: 'transparent',
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
                    width: '95%',
                    height: '95%'
                }
            };

            
            var pie_3d = new google.visualization.PieChart(pie_3d_element);
            pie_3d.draw(data, options_pie_3d);
        }
    };


    
    
    

    return {
        init: function() {
            _googlePie3d();
        }
    }
}();





GooglePie3d.init();
