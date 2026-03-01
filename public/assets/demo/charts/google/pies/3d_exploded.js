





var GoogleDonut3dExploded = function() {


    
    
    

    
    var _googleDonut3dExploded = function() {
        if (typeof google == 'undefined') {
            console.warn('Warning - Google Charts library is not loaded.');
            return;
        }

        
        function color_theme(darkColor, lightColor) {
            return document.documentElement.getAttribute('data-color-theme') == 'dark' ? darkColor : lightColor
        }

        
        google.charts.load('current', {
            callback: function () {

                
                drawDonut3dExploded();

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', drawDonut3dExploded);
                    });
                }

                
                var resizeDonut3dExploded;
                window.addEventListener('resize', function() {
                    clearTimeout(resizeDonut3dExploded);
                    resizeDonut3dExploded = setTimeout(function () {
                        drawDonut3dExploded();
                    }, 200);
                });

                
                document.querySelectorAll('[name="main-theme"]').forEach(function(radio) {
                    radio.addEventListener('change', drawDonut3dExploded);
                });
            },
            packages: ['corechart']
        });

        
        function drawDonut3dExploded() {

            
            var donut_3d_exploded_element = document.getElementById('google-3d-exploded');

            
            var data = google.visualization.arrayToDataTable([
                ['Language', 'Speakers (in millions)'],
                ['Assamese', 13],
                ['Bengali', 83],
                ['Gujarati', 46],
                ['Hindi', 90],
                ['Kannada', 38],
                ['Maithili', 20],
                ['Malayalam', 33],
                ['Marathi', 72],
                ['Oriya', 33],
                ['Punjabi', 29],
                ['Tamil', 61],
                ['Telugu', 74],
                ['Urdu', 52]
            ]);

            
            var options = {
                fontName: 'var(--body-font-family)',
                height: 300,
                width: 540,
                backgroundColor: 'transparent',
                colors: [
                    '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
                    '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
                    '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
                    '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
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
                },
                is3D: true,
                pieSliceText: 'label',
                slices: {  
                    2: {offset: 0.15},
                    8: {offset: 0.1},
                    10: {offset: 0.15},
                    11: {offset: 0.1}
                }
            };

            
            var pie_3d_exploded = new google.visualization.PieChart(donut_3d_exploded_element);
            pie_3d_exploded.draw(data, options);
        }
    };


    
    
    

    return {
        init: function() {
            _googleDonut3dExploded();
        }
    }
}();





GoogleDonut3dExploded.init();
