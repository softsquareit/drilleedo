





var D3LineSeries = function() {


    
    
    

    
    var _lineSeries = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-line-multi-series'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 110, bottom: 20, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
            var parseDate = d3.time.format("%Y%m%d").parse;

            
            var color = d3.scale.category20();



            
            

            
            var x = d3.time.scale()
                .range([0, width]);

            
            var y = d3.scale.linear()
                .range([height, 0]);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(5)
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



            
            

            d3.tsv("../../../assets/demo/data/d3/lines/lines_multi_series.tsv", function(error, data) {

                
                data.forEach(function(d) {
                    d.date = parseDate(d.date);
                });


                
                

                
                color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

                
                var cities = color.domain().map(function(name) {
                    return {
                        name: name,
                        values: data.map(function(d) {
                            return {date: d.date, temperature: +d[name]};
                        })
                    }
                });



                
                

                
                x.domain(d3.extent(data, function(d) { return d.date; }));

                
                y.domain([
                    d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
                    d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
                ]);



                
                
                

                
                var city = svg.selectAll(".multiline-city")
                    .data(cities)
                    .enter()
                    .append("g")
                        .attr("class", "multiline-city");

                
                city.append("path")
                    .attr("class", "d3-line d3-line-medium")
                    .attr("d", function(d) { return line(d.values); })
                    .style("stroke", function(d) { return color(d.name); });

                
                city.append("text")
                    .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
                    .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
                    .attr("class", "d3-cities d3-text")
                    .attr("x", 10)
                    .attr("dy", ".35em")
                    .text(function(d) { return d.name; });
            


                
                

                
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
            })



            
            

            
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


                
                

                
                svg.selectAll('.d3-line').attr("d", function(d) { return line(d.values); });

                
                svg.selectAll('.d3-cities').attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
            }
        }
    };


    
    
    

    return {
        init: function() {
            _lineSeries();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3LineSeries.init();
});
