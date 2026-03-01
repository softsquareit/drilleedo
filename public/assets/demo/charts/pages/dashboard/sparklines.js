





var DashboardSparklines = function() {


    
    
    

    
    var _chartSparkline = function(element, chartType, qty, height, interpolation, duration, interval, color) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var d3Container = d3.select(element),
                margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom;


            
            var data = [];
            for (var i=0; i < qty; i++) {
                data.push(Math.floor(Math.random() * qty) + 5)
            }


            
            

            
            var x = d3.scale.linear().range([0, width]);

            
            var y = d3.scale.linear().range([height - 5, 5]);


            
            

            
            x.domain([1, qty - 3])

            
            y.domain([0, qty])
                


            
            

            
            var line = d3.svg.line()
                .interpolate(interpolation)
                .x(function(d, i) { return x(i); })
                .y(function(d, i) { return y(d); });

            
            var area = d3.svg.area()
                .interpolate(interpolation)
                .x(function(d, i) { 
                    return x(i); 
                })
                .y0(height)
                .y1(function(d) { 
                    return y(d); 
                });



            
            

            
            var container = d3Container.append('svg');

            
            var svg = container
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append("g")
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');



            
            

            
            var clip = svg.append('defs')
                .append('clipPath')
                .attr('id', function(d, i) { return 'load-clip-' + element.substring(1) })

            
            var clips = clip.append('rect')
                .attr('class', 'load-clip')
                .attr('width', 0)
                .attr('height', height);

            
            clips
                .transition()
                    .duration(1000)
                    .ease('linear')
                    .attr('width', width);



            
            
            

            
            var path = svg.append('g')
                .attr('clip-path', function(d, i) { return 'url(#load-clip-' + element.substring(1) + ')'})
                .append('path')
                    .datum(data)
                    .attr('transform', 'translate(' + x(0) + ',0)');

            
            if(chartType == 'area') {
                path.attr('d', area).attr('class', 'd3-area').style('fill', color); 
            }
            else {
                path.attr('d', line).attr('class', 'd3-line d3-line-strong').style('stroke', color); 
            }

            
            path
                .style('opacity', 0)
                .transition()
                    .duration(750)
                    .style('opacity', 1);



            
            

            setInterval(function() {

                
                data.push(Math.floor(Math.random() * qty) + 5);

                
                data.shift();

                update();

            }, interval);



            
            

            function update() {

                
                path
                    .attr('transform', null)
                    .transition()
                        .duration(duration)
                        .ease('linear')
                        .attr('transform', 'translate(' + x(0) + ',0)');

                
                if(chartType == 'area') {
                    path.attr('d', area).attr('class', 'd3-area').style('fill', color)
                }
                else {
                    path.attr('d', line).attr('class', 'd3-line d3-line-strong').style('stroke', color);
                }
            }



            
            

            
            var resizeSparklinesTimer;
            window.addEventListener('resize', function() {
                clearTimeout(resizeSparklinesTimer);
                resizeSparklinesTimer = setTimeout(function () {
                    resizeSparklines();
                }, 200);
            });

            
            var sidebarToggle = document.querySelectorAll('.sidebar-control');
            if (sidebarToggle) {
                sidebarToggle.forEach(function(togglers) {
                    togglers.addEventListener('click', resizeSparklines);
                });
            }

            
            
            
            
            
            function resizeSparklines() {

                
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;


                
                

                
                container.attr('width', width + margin.left + margin.right);

                
                svg.attr('width', width + margin.left + margin.right);

                
                x.range([0, width]);


                
                

                
                clips.attr('width', width);

                
                svg.select('.d3-line').attr('d', line);

                
                svg.select('.d3-area').attr('d', area);
            }
        }
    };


    
    
    

    return {
        init: function() {
            _chartSparkline('#new-visitors', 'line', 30, 35, 'basis', 750, 2000, '#26A69A');
            _chartSparkline('#new-sessions', 'line', 30, 35, 'basis', 750, 2000, '#FF7043');
            _chartSparkline('#total-online', 'line', 30, 35, 'basis', 750, 2000, '#5C6BC0');
            _chartSparkline('#server-load', 'area', 30, 50, 'basis', 750, 2000, 'rgba(255,255,255,0.5)');
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DashboardSparklines.init();
});
