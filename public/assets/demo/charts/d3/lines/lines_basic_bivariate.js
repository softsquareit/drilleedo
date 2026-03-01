





var D3AreaBivariate = function() {


    
    
    

    
    var _areaBivariate = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-area-bivariate'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 10, bottom: 20, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5,
                color = '#ffb980';

            
            var parseDate = d3.time.format("%Y%m%d").parse;



            
            

            
            var x = d3.time.scale()
                .range([0, width]);

            
            var y = d3.scale.linear()
                .range([height, 0]);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(6)
                .tickFormat(d3.time.format("%b"));

            
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");



            
            

            
            var container = d3.select(element).append("svg");

            
            var svg = container
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            
            

            
            var area = d3.svg.area()
                .x(function(d) { return x(d.date); })
                .y0(function(d) { return y(d.low); })
                .y1(function(d) { return y(d.high); });



            
            

            d3.tsv("../../../assets/demo/data/d3/lines/lines_bivariate.tsv", function(error, data) {

                
                data.forEach(function(d) {
                    d.date = parseDate(d.date);
                    d.low = +d.low;
                    d.high = +d.high;
                });


                
                

                
                x.domain(d3.extent(data, function(d) { return d.date; }));

                
                y.domain([d3.min(data, function(d) { return d.low; }), d3.max(data, function(d) { return d.high; })]);



                
                
                

                
                svg.append("path")
                    .datum(data)
                    .attr("class", "d3-area")
                    .attr("fill", color)
                    .attr("d", area);


                
                

                
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
                    .text("Temperature (ºF)");
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


                
                

                
                svg.selectAll('.d3-area').attr("d", area);
            }
        }
    };


    
    
    

    return {
        init: function() {
            _areaBivariate();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3AreaBivariate.init();
});
