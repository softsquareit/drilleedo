





var D3LineDifference = function() {


    
    
    

    
    var _lineDifference = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-difference'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 10, bottom: 20, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
            var parseDate = d3.time.format("%Y%m%d").parse;

            
            var color_above = '#d87a80',
                color_below = '#5ab1ef',
                color_line = '#e5cf0d';



            
            

            
            var x = d3.time.scale()
                .range([0, width]);

            
            var y = d3.scale.linear()
                .range([height, 0]);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(6);

            
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");



            
            

            
            var container = d3Container.append("svg");

            
            var svg = container
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            
            

            
            var line = d3.svg.area()
                .interpolate("basis")
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d["New York"]); });

            
            var area = d3.svg.area()
                .interpolate("basis")
                .x(function(d) { return x(d.date); })
                .y1(function(d) { return y(d["New York"]); });



            
            

            d3.tsv("../../../assets/demo/data/d3/lines/lines_difference.tsv", function(error, data) {

                
                data.forEach(function(d) {
                    d.date = parseDate(d.date);
                    d["New York"]= +d["New York"];
                    d["San Francisco"] = +d["San Francisco"];
                });

                
                svg.datum(data);


                
                

                
                x.domain(d3.extent(data, function(d) { return d.date; }));

                
                y.domain([
                    d3.min(data, function(d) { return Math.min(d["New York"], d["San Francisco"]); }),
                    d3.max(data, function(d) { return Math.max(d["New York"], d["San Francisco"]); })
                ]);


                
                
                

                
                

                svg.append("clipPath")
                  .attr("id", "clip-below")
                  .append("path")
                    .attr("d", area.y0(height));

                svg.append("clipPath")
                  .attr("id", "clip-above")
                  .append("path")
                    .attr("d", area.y0(0));

                svg.append("path")
                  .attr("class", "area mask-above")
                  .attr("clip-path", "url(#clip-above)")
                  .attr("fill", color_above)
                  .attr("d", area.y0(function(d) { return y(d["San Francisco"]); }));

                svg.append("path")
                  .attr("class", "area mask-below")
                  .attr("clip-path", "url(#clip-below)")
                  .attr("fill", color_below)
                  .attr("d", area);


                
                svg.append("path")
                    .attr("class", "d3-line d3-line-medium")
                    .style("stroke", color_line)
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


                
                svg.select('#clip-below path').attr("d", area.y0(height));

                
                svg.select('#clip-above path').attr("d", area.y0(0));


                
                svg.select('.mask-above').attr("d", area.y0(function(d) { return y(d["San Francisco"]); }))

                
                svg.select('.mask-below').attr("d", area);

            }
        }
    };


    
    
    

    return {
        init: function() {
            _lineDifference();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3LineDifference.init();
});
