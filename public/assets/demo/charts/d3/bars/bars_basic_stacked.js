





var D3BarStacked = function() {


    
    
    

    
    var _barStacked = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-bar-stacked'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 10, bottom: 20, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
            var bar_colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];



            
            

            
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1, .5);

            
            var y = d3.scale.linear()
                .rangeRound([height, 0]);

            
            var color = d3.scale.ordinal()
                .range(bar_colors);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickFormat(d3.format(".2s"));



            
            

            
            var container = d3Container.append("svg");

            
            var svg = container
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            
            

            d3.csv("../../../assets/demo/data/d3/bars/bars_stacked.csv", function(error, data) {

                
                color.domain(d3.keys(data[0]).filter(function(key) { return key !== "State"; }));

                
                data.forEach(function(d) {
                    var y0 = 0;
                    d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
                    d.total = d.ages[d.ages.length - 1].y1;
                });

                
                data.sort(function(a, b) { return b.total - a.total; });


                
                

                
                x.domain(data.map(function(d) { return d.State; }));

                
                y.domain([0, d3.max(data, function(d) { return d.total; })]);


                
                
                

                
                

                
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
                    .text("Population");


                
                

                
                var state = svg.selectAll(".bar-group")
                    .data(data)
                    .enter()
                    .append("g")
                        .attr("class", "bar-group")
                        .attr("transform", function(d) { return "translate(" + x(d.State) + ",0)"; });

                
                state.selectAll(".d3-bar")
                    .data(function(d) { return d.ages; })
                    .enter()
                    .append("rect")
                        .attr("class", "d3-bar")
                        .attr("width", x.rangeBand())
                        .attr("y", function(d) { return y(d.y1); })
                        .attr("height", function(d) { return y(d.y0) - y(d.y1); })
                        .style("fill", function(d) { return color(d.name); });


                
                

                
                var legend = svg.selectAll(".d3-legend")
                    .data(color.domain().slice().reverse())
                    .enter()
                    .append("g")
                        .attr("class", "d3-legend")
                        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

                
                legend.append("rect")
                    .attr("x", width - 18)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", color);

                
                legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function(d) { return d; });
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


                
                

                
                x.rangeRoundBands([0, width], .1, .5);

                
                svg.selectAll('.d3-axis-horizontal').call(xAxis);


                
                

                
                svg.selectAll('.bar-group').attr("transform", function(d) { return "translate(" + x(d.State) + ",0)"; });

                
                svg.selectAll('.d3-bar').attr("width", x.rangeBand()).attr("x", function(d) { return x(d.name); });

                
                svg.selectAll(".d3-legend text").attr("x", width - 24);
                svg.selectAll(".d3-legend rect").attr("x", width - 18);
            }
        }
    };


    
    
    

    return {
        init: function() {
            _barStacked();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3BarStacked.init();
});
