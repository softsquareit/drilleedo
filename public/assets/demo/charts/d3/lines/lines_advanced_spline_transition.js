





var D3SplineTransition = function() {


    
    
    

    
    var _splineTransition = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-spline-transition'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 5, bottom: 5, left: 30},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
            var n = 50,
                random = d3.random.normal(0, .35),
                data = d3.range(n).map(random);

            
            var color = '#d87a80';


            
            

            
            var x = d3.scale.linear()
                .domain([1, n - 2])
                .range([0, width]);

            
            var y = d3.scale.linear()
                .domain([-1, 1])
                .range([height, 0]);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");



            
            

            
            var container = d3Container.append("svg");

            
            var svg = container
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            
            

            
            var line = d3.svg.line()
                .interpolate("basis")
                .x(function(d, i) { return x(i); })
                .y(function(d, i) { return y(d); });



            
            
            

            
            svg.append("defs")
                .append("clipPath")
                    .attr("id", "transition-clip")
                    .append("rect")
                        .attr("width", width)
                        .attr("height", height);


            
            

            
            svg.append("g")
                .attr("class", "d3-axis d3-axis-horizontal")
                .attr("transform", "translate(0," + y(0) + ")")
                .call(xAxis);

            
            svg.append("g")
                .attr("class", "d3-axis d3-axis-vertical")
                .call(yAxis);


            
            var path = svg.append("g")
                .attr("clip-path", "url(#transition-clip)")
                .append("path")
                    .datum(data)
                    .attr("d", line)
                    .attr("class", "d3-line d3-line-medium")
                    .style("stroke", color);


            
            

            
            tick();

            
            function tick() {

                
                data.push(random());

                
                path
                    .attr("d", line)
                    .attr("transform", null)
                    .transition()
                        .duration(500)
                        .ease("linear")
                        .attr("transform", "translate(" + x(0) + ",0)")
                        .each("end", tick);

                
                data.shift();
            }



            
            

            
            window.addEventListener('resize', resize);

            
            var sidebarToggle = document.querySelectorAll('.sidebar-control');
            if (sidebarToggle) {
                sidebarToggle.forEach(function(togglers) {
                    togglers.addEventListener('click', resize);
                });
            }

            
            
            
            
            
            function resize() {

                
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;


                
                

                
                container.attr("width", width + margin.left + margin.right);

                
                svg.attr("width", width + margin.left + margin.right);


                
                

                
                x.range([0, width]);

                
                svg.selectAll('.d3-axis-horizontal').call(xAxis);


                
                

                
                svg.selectAll('.d3-line').attr("d", line);

                
                svg.selectAll('#transition-clip rect').attr("width", width);
            }
        }
    };


    
    
    

    return {
        init: function() {
            _splineTransition();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3SplineTransition.init();
});
