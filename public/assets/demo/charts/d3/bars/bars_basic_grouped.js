





var D3BarGrouped = function() {


    
    
    

    
    var _barGrouped = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-bar-grouped'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 10, bottom: 20, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
            var bar_colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];



            
            

            
            var x0 = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            var x1 = d3.scale.ordinal()
                .range([0, width]);

            
            var y = d3.scale.linear()
                .range([height, 0]);

            
            var color = d3.scale.ordinal()
            .range(bar_colors);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x0)
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


            
            

            d3.csv("../../../assets/demo/data/d3/bars/bars_grouped.csv", function(error, data) {

                
                var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "State"; });

                
                data.forEach(function(d) {
                    d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
                });


                
                

                
                x0.domain(data.map(function(d) { return d.State; }));
                x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);

                
                y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);


                
                
                

                
                

                
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
                        .attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; });

                
                state.selectAll(".d3-bar")
                    .data(function(d) { return d.ages; })
                    .enter()
                    .append("rect")
                        .attr("class", "d3-bar")
                        .attr("width", x1.rangeBand())
                        .attr("x", function(d) { return x1(d.name); })
                        .attr("y", function(d) { return y(d.value); })
                        .attr("height", function(d) { return height - y(d.value); })
                        .style("fill", function(d) { return color(d.name); });


                
                

                
                var legend = svg.selectAll(".d3-legend")
                    .data(ageNames.slice().reverse())
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


                
                

                
                x0.rangeRoundBands([0, width], .1);
                x1.rangeRoundBands([0, x0.rangeBand()]);

                
                svg.selectAll('.d3-axis-horizontal').call(xAxis);


                
                

                
                svg.selectAll('.bar-group').attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; });

                
                svg.selectAll('.d3-bar').attr("width", x1.rangeBand()).attr("x", function(d) { return x1(d.name); });

                
                svg.selectAll(".d3-legend text").attr("x", width - 24);
                svg.selectAll(".d3-legend rect").attr("x", width - 18);
            }
        }
    };


    
    
    

    return {
        init: function() {
            _barGrouped();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3BarGrouped.init();
});
