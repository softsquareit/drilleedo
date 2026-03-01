





var D3BarTooltip = function() {


    
    
    

    
    var _barTooltip = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-bar-tooltip'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 10, bottom: 20, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;



            
            

            
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1, .5);

            
            var y = d3.scale.linear()
                .range([height, 0]);

            
            var color = d3.scale.category20c();



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            
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



            
            

            
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return d.frequency;
                });

            
            svg.call(tip);



            
            

            d3.tsv("../../../assets/demo/data/d3/bars/bars_tooltip.tsv", function(error, data) {

                
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
                        .style("fill", function(d) { return color(d.letter); })
                        .attr("x", function(d) { return x(d.letter); })
                        .attr("width", x.rangeBand())
                        .attr("y", function(d) { return y(d.frequency); })
                        .attr("height", function(d) { return height - y(d.frequency); })
                        .on('mouseover', tip.attr('class', 'tooltip-inner in').show)
                        .on('mouseout', tip.hide);
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


                
                

                
                svg.selectAll('.d3-bar').attr("x", function(d) { return x(d.letter); }).attr("width", x.rangeBand());
            }
        }
    };


    
    
    

    return {
        init: function() {
            _barTooltip();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3BarTooltip.init();
});
