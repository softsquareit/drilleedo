





var D3LineGradient = function() {


    
    
    

    
    var _lineGradient = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-line-gradient'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 20, bottom: 20, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
            var parseDate = d3.time.format("%Y%m%d").parse;

            
            var color1 = '#4CAF50',
                color2 = '#FF5722';



            
            

            
            var x = d3.time.scale()
                .range([0, width]);

            
            var y = d3.scale.linear()
                .range([height, 0]);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(7)
                .tickFormat(d3.time.format("%b"));

            
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
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.temperature); });


            
            

            d3.tsv("../../../assets/demo/data/d3/lines/lines_gradient.tsv", function(error, data) {

                
                data.forEach(function(d) {
                    d.date = parseDate(d.date);
                    d.temperature = +d.temperature;
                });


                
                

                
                x.domain([data[0].date, data[data.length - 1].date]);

                
                y.domain(d3.extent(data, function(d) { return d.temperature; }));


                
                
                

                
                svg.append("linearGradient")
                    .attr("id", "temperature-gradient")
                    .attr("gradientUnits", "userSpaceOnUse")
                    .attr("x1", 0)
                    .attr("y1", y(50))
                    .attr("x2", 0)
                    .attr("y2", y(60))
                    .selectAll("stop")
                    .data([
                        {offset: "0%", color: color1},
                        {offset: "100%", color: color2}
                    ])
                    .enter()
                    .append("stop")
                        .attr("offset", function(d) { return d.offset; })
                        .attr("stop-color", function(d) { return d.color; });

                
                svg.append("path")
                    .datum(data)
                    .attr("class", "d3-line d3-line-medium")
                    .attr("stroke", "url(#temperature-gradient)")
                    .attr("d", line);



                
                

                
                svg.append("g")
                    .attr("class", "d3-axis d3-axis-horizontal")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                
                var verticalAxis = svg.append("g")
                    .attr("class", "d3-axis d3-axis-vertical")
                    .call(yAxis);

                
                verticalAxis.append("text")
                    .attr("class", "d3-axis-title")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 10)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Temperature (ºF)");
            });



            
            

            
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
            }
        }
    };


    
    
    

    return {
        init: function() {
            _lineGradient();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3LineGradient.init();
});
