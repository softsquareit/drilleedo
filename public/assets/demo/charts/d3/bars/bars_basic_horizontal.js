





var D3BarHorizontal = function() {


    
    
    

    
    var _barHorizontal = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-bar-horizontal'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 20, right: 10, bottom: 5, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5,
                n = 12;

            
            var format = d3.format(",.0f");

            
            var bar_colors = d3.scale.category20c(),
                bar_text_color = '#fff';



            
            

            
            var x = d3.scale.linear()
                .range([0, width]);

            
            var y = d3.scale.ordinal()
                .rangeRoundBands([0, height], .1);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("top")
                .tickSize(-height);

            
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickSize(5);



            
            

            
            var container = d3Container.append("svg");

            
            var svg = container
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            
            

            d3.csv("../../../assets/demo/data/d3/bars/bars_horizontal.csv", function(data) {

                
                data.forEach(function(d) { d.value = +d.value; });
                data.sort(function(a, b) { return b.value - a.value; });


                
                

                
                x.domain([0, d3.max(data, function(d) { return d.value; })]);

                
                y.domain(data.map(function(d) { return d.name; }));


                
                
                

                
                

                
                svg.append("g")
                    .attr("class", "d3-axis d3-axis-horizontal")
                    .call(xAxis);

                
                svg.append("g")
                    .attr("class", "d3-axis d3-axis-vertical")
                    .call(yAxis);

                
                svg.selectAll(".d3-axis line, .d3-axis path").attr("stroke-width", 0);


                
                

                
                var bar = svg.selectAll(".d3-bar-group")
                    .data(data)
                    .enter()
                    .append("g")
                        .attr("class", "d3-bar-group")
                        .attr("fill", function(d, i) { return bar_colors(i); })
                        .attr("transform", function(d) { return "translate(0," + y(d.name) + ")"; });

                
                bar.append("rect")
                    .attr("class", "d3-bar")
                    .attr("width", function(d) { return x(d.value); })
                    .attr("height", y.rangeBand());

                
                bar.append("text")
                    .attr("class", "d3-label-value")
                    .attr("x", function(d) { return x(d.value); })
                    .attr("y", y.rangeBand() / 2)
                    .attr("dx", -10)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .style("fill", bar_text_color)
                    .style("font-size", 12)
                    .text(function(d) { return format(d.value); });
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


                
                

                
                svg.selectAll('.d3-bar').attr("width", function(d) { return x(d.value); })

                
                svg.selectAll('.d3-label-value').attr("x", function(d) { return x(d.value); });
            }
        }
    };


    
    
    

    return {
        init: function() {
            _barHorizontal();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3BarHorizontal.init();
});
