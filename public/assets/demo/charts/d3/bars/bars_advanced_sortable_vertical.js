





var D3BarSortableVertical = function() {


    
    
    

    
    var _barSortableVertical = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-bar-sortable-vertical'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 20, bottom: 20, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
            var formatPercent = d3.format(".0%");

            
            var colors = d3.scale.category20c();



            
            

            
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1, 1);

            
            var y = d3.scale.linear()
                .range([height, 0]);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickFormat(formatPercent);



            
            

            
            var container = d3Container.append("svg");

            
            var svg = container
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            
            

            d3.tsv("../../../assets/demo/data/d3/bars/bars_basic.tsv", function(error, data) {

                
                data.forEach(function(d) {
                    d.frequency = +d.frequency;
                });


                
                

                
                x.domain(data.map(function(d) { return d.letter; }));

                
                y.domain([0, d3.max(data, function(d) { return d.frequency; })]);


                
                
                

                
                

                
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
                    .text("Frequency");


                
                

                svg.selectAll(".d3-bar")
                    .data(data)
                    .enter()
                    .append("rect")
                        .attr("class", "d3-bar")
                        .attr("fill", function(d, i) { return colors(i); })
                        .attr("x", function(d) { return x(d.letter); })
                        .attr("width", x.rangeBand())
                        .attr("y", function(d) { return y(d.frequency); })
                        .attr("height", function(d) { return height - y(d.frequency); });


                
                

                
                d3.select(".toggle-sort").on("change", change);

                
                var sortTimeout = setTimeout(function() {
                    d3.select(".toggle-sort").property("checked", true).each(change);
                }, 2000);

                
                function change() {
                    clearTimeout(sortTimeout);

                    
                    var x0 = x.domain(data.sort(this.checked
                        ? function(a, b) { return b.frequency - a.frequency; }
                        : function(a, b) { return d3.ascending(a.letter, b.letter); })
                        .map(function(d) { return d.letter; }))
                        .copy();

                    var transition = svg.transition().duration(750),
                        delay = function(d, i) { return i * 50; };

                    transition.selectAll(".d3-bar")
                        .delay(delay)
                        .attr("x", function(d) { return x0(d.letter); });

                    transition.select(".d3-axis-horizontal")
                        .call(xAxis)
                        .selectAll("g")
                        .delay(delay);
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


                
                

                
                x.rangeRoundBands([0, width], .1, 1);

                
                svg.selectAll('.d3-axis-horizontal').call(xAxis);


                
                

                
                svg.selectAll('.d3-bar').attr("width", x.rangeBand()).attr("x", function(d) { return x(d.letter); });
            }
        }
    };


    
    
    

    return {
        init: function() {
            _barSortableVertical();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3BarSortableVertical.init();
});
