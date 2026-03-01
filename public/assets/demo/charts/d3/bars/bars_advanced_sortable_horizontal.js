





var D3BarSortableHorizontal = function() {


    
    
    

    
    var _barSortableHorizontal = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-bar-sortable-horizontal'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 20, bottom: 20, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
            var index = d3.range(8),
            data = index.map(d3.random.normal(40, 10));

            
            var bar_colors = d3.scale.category20c(),
                bar_text_color = '#fff';



            
            

            
            var x = d3.scale.linear()
                .domain([0, d3.max(data)])
                .range([0, width]);

            
            var y = d3.scale.ordinal()
                .domain(index)
                .rangeRoundBands([height, 0], .3);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(8);



            
            

            
            var container = d3Container.append("svg");

            
            var svg = container
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            
            
            

            
            

            
            svg.append("g")
                .attr("class", "d3-axis d3-axis-horizontal")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            
            svg.append("g")
                .attr("class", "d3-axis d3-axis-vertical")
                .call(yAxis);


            
            

            
            var bar = svg.selectAll(".d3-bar")
                .data(data)
                .enter()
                .append("g")
                    .attr("class", "d3-bar")
                    .attr("fill", function(d, i) { return bar_colors(i); })
                    .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

            
            bar.append("rect")
                .attr("height", y.rangeBand())
                .attr("width", x);

            
            bar.append("text")
                .attr("x", function(d) { return x(d) - 12 })
                .attr("y", y.rangeBand() / 2)
                .attr("dy", ".35em")
                .style("fill", bar_text_color)
                .style("text-anchor", "end")
                .text(function(d, i) { return i; });


            
            

            var sort = false;
            setInterval(function() {
                if (sort = !sort) {
                    index.sort(function(a, b) { return data[a] - data[b]; });
                } else {
                    index = d3.range(8);
                }

                y.domain(index);

                bar.transition()
                    .duration(750)
                    .delay(function(d, i) { return i * 50; })
                    .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });
            }, 4000);



            
            

            
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


                
                

                
                svg.selectAll('.d3-bar rect').attr("width", x);

                
                svg.selectAll('.d3-bar text').attr("x", function(d) { return x(d) - 12; });
            }
        }
    };


    
    
    

    return {
        init: function() {
            _barSortableHorizontal();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3BarSortableHorizontal.init();
});
