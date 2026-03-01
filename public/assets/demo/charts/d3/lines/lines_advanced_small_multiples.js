





var D3AreaMultiples = function() {


    
    
    

    
    var _areaMultiples = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-small-multiples'),
            height = 100;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 10, bottom: 5, left: 10},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
            var parseDate = d3.time.format("%b %Y").parse;

            
            var area_color = '#66bb6a',
                text_color = '#fff';



            
            

            
            var x = d3.time.scale()
                .range([0, width]);

            
            var y = d3.scale.linear()
                .range([height, 0]);



            
            

            
            var area = d3.svg.area()
                .interpolate("monotone")
                .x(function(d) { return x(d.date); })
                .y0(height)
                .y1(function(d) { return y(d.price); });

            
            var line = d3.svg.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.price); });


            
            

            d3.csv("../../../assets/demo/data/d3/lines/lines_small_multiples.csv", function(error, data) {

                
                data.forEach(function(d) {
                    d.price = +d.price;
                    d.date = parseDate(d.date);
                })

                
                var symbols = d3.nest()
                    .key(function(d) { return d.symbol; })
                    .entries(data);

                
                symbols.forEach(function(s) {
                    s.maxPrice = d3.max(s.values, function(d) { return d.price; });
                });

                
                
                x.domain([
                    d3.min(symbols, function(s) { return s.values[0].date; }),
                    d3.max(symbols, function(s) { return s.values[s.values.length - 1].date; })
                ]);


                
                

                
                var svg = d3Container.selectAll("svg")
                    .data(symbols)
                    .enter()
                    .append("svg")
                        .attr("class", "d3-multiples")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


                
                
                

                
                svg.append("path")
                    .attr("d", function(d) { y.domain([0, d.maxPrice]); return area(d.values); })
                    .attr("class", "d3-area")
                    .style("fill", area_color);

                
                svg.append("text")
                    .attr("class", "d3-multiples-label")
                    .attr("x", width - 8)
                    .attr("y", height - 8)
                    .style("fill", text_color)
                    .style("text-anchor", "end")
                    .style("text-weight", 500)
                    .text(function(d) { return d.key; });



                
                

                
                window.addEventListener('resize', resize);

                
            var sidebarToggle = document.querySelectorAll('.sidebar-control');
            if (sidebarToggle) {
                sidebarToggle.forEach(function(togglers) {
                    togglers.addEventListener('click', resize);
                });
            }

                
                
                
                
                
                function resize() {

                    
                    width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;


                    
                    

                    
                    d3.selectAll(".d3-multiples").attr("width", width + margin.left + margin.right);

                    
                    x.range([0, width]);


                    
                    

                    
                    svg.selectAll('.d3-area').attr("d", function(d) { y.domain([0, d.maxPrice]); return area(d.values); });

                    
                    svg.selectAll('.d3-multiples-label').attr("x", width - 8);
                }
            });
        }
    };


    
    
    

    return {
        init: function() {
            _areaMultiples();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3AreaMultiples.init();
});
