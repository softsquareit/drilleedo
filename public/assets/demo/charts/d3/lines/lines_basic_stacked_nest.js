





var D3AreaStackedNest = function() {


    
    
    

    
    var _areaStackedNest = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-area-stacked-nest'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 20, bottom: 20, left: 40},
                n = 3,
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
            var format = d3.time.format("%m/%d/%y");

            
            var colors = ["#75c476", "#31a354"];



            
            

            
            var x = d3.time.scale()
                .range([0, width]);

            
            var y = d3.scale.linear()
                .range([height, 0]);

            
            var z = d3.scale.linear()
                .domain([0, n - 1])
                .range(colors);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(d3.time.days);

            
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");



            
            

            
            var container = d3.select(element).append("svg");

            
            var svg = container
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            
            

            
            var stack = d3.layout.stack()
                .offset("zero")
                .values(function(d) { return d.values; })
                .x(function(d) { return d.date; })
                .y(function(d) { return d.value; });

            
            var nest = d3.nest()
                .key(function(d) { return d.key; });

            
            var area = d3.svg.area()
                .interpolate("basis")
                .x(function(d) { return x(d.date); })
                .y0(function(d) { return y(d.y0); })
                .y1(function(d) { return y(d.y0 + d.y); });




            
            

            d3.csv("../../../assets/demo/data/d3/lines/lines_stacked_nest.csv", function(error, data) {

                
                data.forEach(function(d) {
                    d.date = format.parse(d.date);
                    d.value = +d.value;
                });

                
                var layers = stack(nest.entries(data));


                
                

                
                x.domain(d3.extent(data, function(d) { return d.date; }));

                
                y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);


                
                
                

                
                svg.selectAll(".d3-area")
                    .data(layers)
                    .enter()
                    .append("path")
                    .attr("class", "d3-area d3-slice-border")
                    .attr("d", function(d) { return area(d.values); })
                    .style("fill", function(d, i) { return z(i); });


                
                

                
                svg.append("g")
                    .attr("class", "d3-axis d3-axis-horizontal")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                
                svg.append("g")
                    .attr("class", "d3-axis d3-axis-vertical")
                    .call(yAxis);
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


                
                

                
                svg.selectAll('.d3-area').attr("d", function(d) { return area(d.values); })
            }
        }
    };


    
    
    

    return {
        init: function() {
            _areaStackedNest();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3AreaStackedNest.init();
});