





var D3BarHierarchy = function() {


    
    
    

    
    var _barHierarchy = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-hierarchical-bars'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 25, right: 40, bottom: 20, left: 130},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5,
                barHeight = 30,
                duration = 750,
                delay = 25;

            
            var color_range = ["#31a354", "#c7e9bf"];


            
            

            
            var x = d3.scale.linear()
                .range([0, width]);

            
            var color = d3.scale.ordinal()
                .range(color_range);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("top");



            
            

            
            var container = d3Container.append("svg");

            
            var svg = container
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            
            

            
            var partition = d3.layout.partition()
                .value(function(d) { return d.size; });



            
            

            d3.json("../../../assets/demo/data/d3/bars/bars_hierarchical.json", function(error, root) {
                partition.nodes(root);
                x.domain([0, root.value]).nice();
                down(root, 0);
            });


            
            
            

            
            svg.append("rect")
                .attr("class", "d3-bars-background")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "transparent")
                .on("click", up);


            
            

            
            svg.append("g")
                .attr("class", "d3-axis d3-axis-horizontal");


            
            

            
            function down(d, i) {
                if (!d.children || this.__transition__) return;
                var end = duration + d.children.length * delay;

                
                var exit = svg.selectAll(".enter")
                    .attr("class", "exit");

                
                exit.selectAll("rect").filter(function(p) { return p === d; })
                    .style("fill-opacity", 1e-6);

                
                
                var enter = bar(d)
                    .attr("transform", stack(i))
                    .style("opacity", 1);

                
                
                enter.select("text").style("fill-opacity", 1e-6);
                enter.select("rect").style("fill", color(true));

                
                x.domain([0, d3.max(d.children, function(d) { return d.value; })]).nice();

                
                svg.selectAll(".d3-axis-horizontal").transition()
                    .duration(duration)
                    .call(xAxis);

                
                var enterTransition = enter.transition()
                    .duration(duration)
                    .delay(function(d, i) { return i * delay; })
                    .attr("transform", function(d, i) { return "translate(0," + barHeight * i * 1.2 + ")"; });

                
                enterTransition.select("text")
                    .style("fill-opacity", 1);

                
                enterTransition.select("rect")
                    .attr("width", function(d) { return x(d.value); })
                    .style("fill", function(d) { return color(!!d.children); });

                
                var exitTransition = exit.transition()
                    .duration(duration)
                    .style("opacity", 1e-6)
                    .remove();

                
                exitTransition.selectAll("rect")
                    .attr("width", function(d) { return x(d.value); });

                
                svg.select(".d3-bars-background")
                    .datum(d)
                    .transition()
                    .duration(end);

                d.index = i;
            }

            
            function up(d) {
                if (!d.parent || this.__transition__) return;
                var end = duration + d.children.length * delay;

                
                var exit = svg.selectAll(".enter")
                    .attr("class", "exit");

                
                var enter = bar(d.parent)
                    .attr("transform", function(d, i) { return "translate(0," + barHeight * i * 1.2 + ")"; })
                    .style("opacity", 1e-6);

                
                
                enter.select("rect")
                    .style("fill", function(d) { return color(!!d.children); })
                    .filter(function(p) { return p === d; })
                    .style("fill-opacity", 1e-6);

                
                x.domain([0, d3.max(d.parent.children, function(d) { return d.value; })]).nice();

                
                svg.selectAll(".d3-axis-horizontal").transition()
                    .duration(duration)
                    .call(xAxis);

                
                var enterTransition = enter.transition()
                    .duration(end)
                    .style("opacity", 1);

                
                
                enterTransition.select("rect")
                    .attr("width", function(d) { return x(d.value); })
                    .each("end", function(p) { if (p === d) d3.select(this).style("fill-opacity", null); });

                
                var exitTransition = exit.selectAll("g").transition()
                    .duration(duration)
                    .delay(function(d, i) { return i * delay; })
                    .attr("transform", stack(d.index));

                
                exitTransition.select("text")
                    .style("fill-opacity", 1e-6);

                
                exitTransition.select("rect")
                    .attr("width", function(d) { return x(d.value); })
                    .style("fill", color(true));

                
                exit.transition()
                    .duration(end)
                    .remove();

                
                svg.select(".d3-bars-background")
                    .datum(d.parent)
                    .transition()
                    .duration(end);
            }

            
            function bar(d) {
                var bar = svg.insert("g", ".d3-axis-vertical")
                    .attr("class", "enter")
                    .attr("transform", "translate(0,5)")
                    .selectAll("g")
                    .data(d.children)
                    .enter()
                    .append("g")
                        .style("cursor", function(d) { return !d.children ? null : "pointer"; })
                        .on("click", down);

                bar.append("text")
                    .attr("class", "d3-text")
                    .attr("x", -6)
                    .attr("y", barHeight / 2)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function(d) { return d.name; });

                bar.append("rect")
                    .attr("width", function(d) { return x(d.value); })
                    .attr("height", barHeight);

                return bar;
            }

            
            function stack(i) {
                var x0 = 0;
                return function(d) {
                    var tx = "translate(" + x0 + "," + barHeight * i * 1.2 + ")";
                    x0 += x(d.value);
                    return tx;
                };
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


                
                

                
                svg.selectAll('.enter rect').attr("width", function(d) { return x(d.value); });
            }
        }
    };


    
    
    

    return {
        init: function() {
            _barHierarchy();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3BarHierarchy.init();
});
