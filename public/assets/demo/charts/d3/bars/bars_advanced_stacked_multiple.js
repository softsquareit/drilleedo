





var D3BarStackedMultiple = function() {


    
    
    

    
    var _barStackedMultiple = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-bar-stacked-multiples'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 20, bottom: 20, left: 60},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
            var parseDate = d3.time.format("%Y-%m").parse,
                formatYear = d3.format("02d"),
                formatDate = function(d) { return "Q" + ((d.getMonth() / 3 | 0) + 1) + formatYear(d.getFullYear() % 100); };

            
            var color = d3.scale.category20();



            
            

            
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .2);

            
            var y = d3.scale.ordinal()
                .rangeRoundBands([height, 0]);

            var y0 = d3.scale.ordinal()
                .rangeRoundBands([height, 0]);

            var y1 = d3.scale.linear();



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickFormat(formatDate);

            
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(10, "%");



            
            

            
            var container = d3Container.append("svg");

            
            var svg = container
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            
            

            
            var nest = d3.nest()
                .key(function(d) { return d.browser; });

            
            var stack = d3.layout.stack()
                .values(function(d) { return d.values; })
                .x(function(d) { return d.date; })
                .y(function(d) { return d.value; })
                .out(function(d, y0) { d.valueOffset = y0; });




            
            

            d3.tsv("../../../assets/demo/data/d3/bars/bars_stacked_multiple.tsv", function(error, data) {

                
                data.forEach(function(d) {
                    d.date = parseDate(d.date);
                    d.value = +d.value;
                });

                
                var dataByGroup = nest.entries(data);


                
                

                
                stack(dataByGroup);

                
                x.domain(dataByGroup[0].values.map(function(d) { return d.date; }));

                
                y0.domain(dataByGroup.map(function(d) { return d.key; }));
                y1.domain([0, d3.max(data, function(d) { return d.value; })]).range([y0.rangeBand(), 0]);


                
                
                

                
                

                
                var group = svg.selectAll(".d3-bar-group")
                    .data(dataByGroup)
                    .enter()
                    .append("g")
                        .attr("class", "d3-bar-group")
                        .attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });

                
                group.append("text")
                    .attr("class", "d3-group-label d3-text")
                    .attr("x", -12)
                    .attr("y", function(d) { return y1(d.values[0].value / 2); })
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function(d) { return d.key; });

                
                group.selectAll(".d3-bar")
                    .data(function(d) { return d.values; })
                    .enter()
                    .append("rect")
                        .attr("class", "d3-bar")
                        .attr("x", function(d) { return x(d.date); })
                        .attr("y", function(d) { return y1(d.value); })
                        .attr("width", x.rangeBand())
                        .attr("height", function(d) { return y0.rangeBand() - y1(d.value); })
                        .style("fill", function(d) { return color(d.browser); });


                
                

                
                group.filter(function(d, i) { return !i; }).append("g")
                    .attr("class", "d3-axis d3-axis-horizontal")
                    .attr("transform", "translate(0," + (y0.rangeBand() + 1) + ")")
                    .call(xAxis);

                
                var verticalAxis = svg.append("g")
                    .attr("class", "d3-axis d3-axis-vertical")
                    .call(yAxis);

                
                verticalAxis.append("text")
                    .attr('class', 'd3-axis-title browser-label')
                    .attr("x", -12)
                    .attr("y", 12)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Browser");


                
                

                
                d3.selectAll(".stacked-multiple").on("change", change);

                
                var timeout = setTimeout(function() {
                    d3.selectAll("input[value=\"stacked\"]").property("checked", true).each(change);
                }, 2000);

                
                function change() {
                    clearTimeout(timeout);
                    if (this.value === "multiples") transitionMultiples();
                    else transitionStacked();
                }

                
                function transitionMultiples() {
                    var t = svg.transition().duration(750),
                    g = t.selectAll(".d3-bar-group").attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
                    g.selectAll(".d3-bar").attr("y", function(d) { return y1(d.value); });
                    g.select(".d3-group-label").attr("y", function(d) { return y1(d.values[0].value / 2); })
                }

                
                function transitionStacked() {
                    var t = svg.transition().duration(750),
                    g = t.selectAll(".d3-bar-group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
                    g.selectAll(".d3-bar").attr("y", function(d) { return y1(d.value + d.valueOffset) });
                    g.select(".d3-group-label").attr("y", function(d) { return y1(d.values[0].value / 2 + d.values[0].valueOffset); })
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


                
                

                
                x.rangeRoundBands([0, width], .2);

                
                svg.selectAll('.d3-axis-horizontal').call(xAxis);


                
                

                
                svg.selectAll('.d3-bar').attr("x", function(d) { return x(d.date); }).attr("width", x.rangeBand());
            }
        }
    };


    
    
    

    return {
        init: function() {
            _barStackedMultiple();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3BarStackedMultiple.init();
});
