





var D3AreaStacked = function() {


    
    
    

    
    var _areaStacked = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-area-stacked'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 10, bottom: 20, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
            var parseDate = d3.time.format("%y-%b-%d").parse,
                formatPercent = d3.format(".0%");

            
            var color = d3.scale.category20();


            
            

            
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
                .orient("left")
                .tickFormat(formatPercent);



            
            

            
            var container = d3.select(element).append("svg");

            
            var svg = container
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            
            

            
            var area = d3.svg.area()
                .x(function(d) { return x(d.date); })
                .y0(function(d) { return y(d.y0); })
                .y1(function(d) { return y(d.y0 + d.y); });

            
            var stack = d3.layout.stack()
                .values(function(d) { return d.values; });





            
            

            d3.tsv("../../../assets/demo/data/d3/lines/lines_stacked.tsv", function(error, data) {

                
                data.forEach(function(d) {
                    d.date = parseDate(d.date);
                });


                
                

                
                color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

                
                var browsers = stack(color.domain().map(function(name) {
                    return {
                        name: name,
                        values: data.map(function(d) {
                            return {date: d.date, y: d[name] / 100};
                        })
                    };
                }));


                
                

                
                x.domain(d3.extent(data, function(d) { return d.date; }));


                
                
                

                
                var browser = svg.selectAll(".browser")
                    .data(browsers)
                    .enter()
                    .append("g")
                        .attr("class", "browser");

                
                browser.append("path")
                    .attr("class", "d3-area")
                    .attr("d", function(d) { return area(d.values); })
                    .style("fill", function(d) { return color(d.name); });

                
                browser.append("text")
                    .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
                    .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
                    .attr("class", "d3-browsers")
                    .attr("x", -15)
                    .attr("dy", ".35em")
                    .style("fill", "#fff")
                    .style("text-anchor", "end")
                    .text(function(d) { return d.name; });


                
                

                
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


                
                

                
                svg.selectAll('.d3-area').attr("d", function(d) { return area(d.values); });

                
                svg.selectAll('.d3-browsers').attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; });
            }
        }
    };


    
    
    

    return {
        init: function() {
            _areaStacked();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3AreaStacked.init();
});
