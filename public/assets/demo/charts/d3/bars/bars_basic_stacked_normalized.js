





var D3BarNormalized = function() {


    
    
    

    
    var _barNormalized = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-bar-normalized'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 130, bottom: 20, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
            var bar_colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];



            
            

            
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            
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
                .tickFormat(d3.format(".0%"));



            
            

            
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
                    d.ages.forEach(function(d) { d.y0 /= y0; d.y1 /= y0; });
                });

                
                data.sort(function(a, b) { return b.ages[0].y1 - a.ages[0].y1; });


                
                

                
                x.domain(data.map(function(d) { return d.State; }));



                
                
                

                
                

                
                svg.append("g")
                    .attr("class", "d3-axis d3-axis-horizontal")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                
                svg.append("g")
                    .attr("class", "d3-axis d3-axis-vertical")
                    .call(yAxis);



                
                

                
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



                
                

                
                var legend = svg.select(".bar-group:last-child")
                    .selectAll(".d3-legend")
                    .data(function(d) { return d.ages; })
                    .enter().append("g")
                    .attr("class", "d3-legend")
                    .attr("transform", function(d) { return "translate(" + x.rangeBand() + "," + y((d.y0 + d.y1) / 2) + ")"; });

                
                legend.append("line")
                    .attr("x2", 10);

                
                legend.append("text")
                    .attr("x", 15)
                    .attr("dy", ".35em")
                    .text(function(d) { return d.name; });
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


                
                

                
                x.rangeRoundBands([0, width], .1);

                
                svg.selectAll('.d3-axis-horizontal').call(xAxis);


                
                

                
                svg.selectAll('.bar-group').attr("transform", function(d) { return "translate(" + x(d.State) + ",0)"; });

                
                svg.selectAll('.d3-bar').attr("width", x.rangeBand())

                
                svg.selectAll(".d3-legend").attr("transform", function(d) { return "translate(" + x.rangeBand() + "," + y((d.y0 + d.y1) / 2) + ")"; });
            }
        }
    };


    
    
    

    return {
        init: function() {
            _barNormalized();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3BarNormalized.init();
});
