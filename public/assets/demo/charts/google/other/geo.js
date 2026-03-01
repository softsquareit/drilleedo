





var GoogleGeoRegion = function() {


    
    
    

    
    var _googleGeoRegion = function() {
        if (typeof google == 'undefined') {
            console.warn('Warning - Google Charts library is not loaded.');
            return;
        }

        
        function color_theme(darkColor, lightColor) {
            return document.documentElement.getAttribute('data-color-theme') == 'dark' ? darkColor : lightColor
        }

        
        google.charts.load('current', {
            callback: function () {

                
                drawRegionsMap();

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', drawRegionsMap);
                    });
                }

                
                var resizeGeoRegion;
                window.addEventListener('resize', function() {
                    clearTimeout(resizeGeoRegion);
                    resizeGeoRegion = setTimeout(function () {
                        drawRegionsMap();
                    }, 200);
                });

                
                document.querySelectorAll('[name="main-theme"]').forEach(function(radio) {
                    radio.addEventListener('change', drawRegionsMap);
                });
            },
            packages: ['geochart']
        });

        
        function drawRegionsMap() {

            
            var geo_region_element = document.getElementById('google-geo-region');

            
            var data = google.visualization.arrayToDataTable([
                ['Country', 'Popularity'],
                ['Germany', 200],
                ['United States', 300],
                ['Brazil', 400],
                ['Canada', 500],
                ['France', 600],
                ['RU', 700]
            ]);

            
            var options = {
                fontName: 'var(--body-font-family)',
                height: 500,
                width: "100%",
                fontSize: 12,
                backgroundColor: 'transparent',
                datalessRegionColor: color_theme('#404249', '#f5f5f5'),
                tooltip: {
                    textStyle: {
                        fontSize: 14
                    }
                },
                colorAxis: {
                    colors: [color_theme('#467045', '#efe6dc'), color_theme('#81de7e', '#109618')]
                }
            };

            
            var chart = new google.visualization.GeoChart(geo_region_element);
            chart.draw(data, options);
        }
    };


    
    
    

    return {
        init: function() {
            _googleGeoRegion();
        }
    }
}();





GoogleGeoRegion.init();
