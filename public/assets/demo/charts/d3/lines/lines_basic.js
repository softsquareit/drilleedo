





var D3LineBasic = function() {


    
    
    

    
    var _lineBasic = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-line-basic'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 20, bottom: 20, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5,
                color = '#b6a2de';

            
            var parseDate = d3.time.format("%d-%b-%y").parse,
                bisectDate = d3.bisector(function(d) { return d.date; }).left,
                formatValue = d3.format(",.2f"),
                formatCurrency = function(d) { return "$" + formatValue(d); }



            
            

            
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
                .y(function(d) { return y(d.close); });



            
            

            d3.tsv("../../../assets/demo/data/d3/lines/lines_basic.tsv", function(error, data) {

                
                data.forEach(function(d) {
                    d.date = parseDate(d.date);
                    d.close = +d.close;
                });

                
                data.sort(function(a, b) {
                    return a.date - b.date;
                });


                
                

                
                x.domain(d3.extent(data, function(d) { return d.date; }));

                
                y.domain([0, d3.max(data, function(d) { return d.close; })]);


                
                
                

                
                svg.append("path")
                    .datum(data)
                        .attr("class", "d3-line d3-line-strong")
                        .attr("d", line)
                        .style("fill", "none")
                        .style("stroke", color);



                
                

                
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
                    .text("Price ($)");




                
                

                
                var focus = svg.append("g")
                    .attr("class", "d3-crosshair-pointer")
                    .style("display", "none");

                
                focus.append("circle")
                    .attr("class", "d3-line-circle d3-line-strong")
                    .attr("r", 4)
                    .style("fill", color)
                    .style("stroke", color);

                
                focus.append("text")
                    .attr("dy", ".35em")
                    .style("stroke", "none");

                
                svg.append("rect")
                    .attr("class", "d3-crosshair-overlay")
                    .attr("width", width)
                    .attr("height", height)
                    .on("mouseover", function() { focus.style("display", null); })
                    .on("mouseout", function() { focus.style("display", "none"); })
                    .on("mousemove", mousemove);

                
                function mousemove() {
                    var x0 = x.invert(d3.mouse(this)[0]),
                    i = bisectDate(data, x0, 1),
                    d0 = data[i - 1],
                    d1 = data[i],
                    d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                    focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
                    focus.select("text").attr("class", "text-body").text(formatCurrency(d.close)).attr("dx", -26).attr("dy", 30);
                }
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

                
                svg.selectAll('.d3-crosshair-overlay').attr("width", width);
            }
        }
    };


    
    
    

    return {
        init: function() {
            _lineBasic();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3LineBasic.init();
});
