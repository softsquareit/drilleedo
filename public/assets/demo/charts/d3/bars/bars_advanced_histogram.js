





var D3BarHistogram = function() {


    
    
    

    
    var _barHistogram = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-histogram'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 15, right: 20, bottom: 20, left: 60},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
            var values = d3.range(1000).map(d3.random.bates(4));

            
            var formatCount = d3.format(",.0f");

            
            var color = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);



            
            

            
            var x = d3.scale.linear()
                .domain([0, 1])
                .range([0, width]);

            
            var data = d3.layout.histogram()
                .bins(x.ticks(20))
                (values);

            
            var y = d3.scale.linear()
                .domain([0, d3.max(data, function(d) { return d.y; })])
                .range([height, 0]);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");



            
            

            
            var container = d3Container.append("svg");

            
            var svg = container
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            
            

            
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-25, 0])
                .html(function(d) {
                    return "Current value: " + "<span class='font-weight-semibold'>" + formatCount(d.y) + "</span>";
                })

            
            svg.call(tip);


            
            
            

            
            

            
            var bar = svg.selectAll(".d3-bar")
                .data(data)
                .enter()
                .append("g")
                    .attr("class", "d3-bar")
                    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

            
            bar.append("rect")
                .attr("x", 1)
                .attr("width", x(data[0].dx) - 3)
                .attr("height", function(d) { return height - y(d.y); })
                .style("fill", function(d) { return color(d); });

            
            bar.append("text")
                .attr("class", "d3-text")
                .attr("dy", ".75em")
                .attr("y", -15)
                .attr("x", x(data[0].dx) / 2)
                .style("text-anchor", "middle")
                .text(function(d) { return formatCount(d.y); });

            
            

            
            svg.append("g")
                .attr("class", "d3-axis d3-axis-horizontal")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);



            
            

            
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


                
                

                
                svg.selectAll('.d3-bar').attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

                
                svg.selectAll('.d3-bar rect').attr("x", 1).attr("width", x(data[0].dx) - 3);

                
                svg.selectAll('.d3-bar text').attr("x", x(data[0].dx) / 2);
            }
        }
    };


    
    
    

    return {
        init: function() {
            _barHistogram();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3BarHistogram.init();
});
