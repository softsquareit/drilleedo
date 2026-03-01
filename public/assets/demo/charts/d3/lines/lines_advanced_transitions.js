





var D3ChainedTransitions = function() {


    
    
    

    
    var _lineTransitions = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-chained-transitions'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 100, bottom: 20, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;


            
            var city = "New York";

            
            parseDate = d3.time.format("%Y%m%d").parse;

            
            var color = '#b6a2de';



            
            

            
            var x = d3.time.scale()
                .range([0, width]);

            
            var y = d3.scale.linear()
                .range([height, 0]);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(6)
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
                .y(function(d) { return y(d[city]); });



            
            
            
            d3.tsv("../../../assets/demo/data/d3/lines/lines_transitions.tsv", function(error, data) {

                
                data.forEach(function(d) {
                    d.date = parseDate(d.date);
                    d["New York"] = +d["New York"];
                    d["San Francisco"] = +d["San Francisco"];
                });


                
                

                
                x.domain([data[0].date, data[data.length - 1].date]);

                
                y.domain(d3.extent(data, function(d) { return d[city]; }));


                
                
                

                
                svg.append("path")
                    .datum(data)
                    .attr("d", line)
                    .attr("class", "d3-line d3-line-medium")
                    .style("stroke", color);


                
                svg.append("text")
                    .datum(data[data.length - 1])
                    .attr("class", "d3-city d3-text")
                    .attr("transform", transform)
                    .attr("x", 3)
                    .attr("dy", ".35em")
                    .text(city);


                
                

                
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


                
                

                
                d3.selectAll(".d3-transitions-control").on("change", change);

                
                var timeout = setTimeout(function() {
                    d3.select("input[value=\"San Francisco\"]").property("checked", true).each(change);
                }, 3000);

                
                function change() {
                    clearTimeout(timeout);
                    city = this.value;

                    
                    var t0 = svg.transition().duration(750);
                    t0.selectAll(".d3-line").attr("d", line);
                    t0.selectAll(".d3-city").attr("transform", transform).text(city);

                    
                    y.domain(d3.extent(data, function(d) { return d[city]; }));
                    var t1 = t0.transition();
                    t1.selectAll(".d3-line").attr("d", line);
                    t1.selectAll(".d3-city").attr("transform", transform);
                    t1.selectAll(".d3-axis-vertical").call(yAxis);
                }

                
                function transform(d) {
                    return "translate(" + x(d.date) + "," + y(d[city]) + ")";
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

                    
                    svg.selectAll(".d3-city").attr("transform", transform);
                }
            });
        }
    };


    
    
    

    return {
        init: function() {
            _lineTransitions();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3ChainedTransitions.init();
});
