





var D3PieDonutMultipleNesting = function() {


    
    
    

    
    var _pieDonutMultipleNesting = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-donut-nesting'),
            radius = 110,
            margin = 10;


        
        if(element) {

            
            

            
            var slice_colors = d3.scale.category20c(),
                slice_text_color = '#fff';


            
            

            d3.csv("../../../assets/demo/data/d3/pies/pies_nesting.csv", function(flights) {

                
                var airports = d3.nest()
                    .key(function(d) { return d.origin; })
                    .entries(flights);


                
                

                
                var svg = d3.select(element)
                    .selectAll("svg")
                    .data(airports)
                    .enter()
                        .append("svg")
                            .attr("width", (radius + margin) * 2)
                            .attr("height", (radius + margin) * 2)
                            .append("g")
                                .attr("transform", "translate(" + (radius + margin) + "," + (radius + margin) + ")");


                
                

                
                var arc = d3.svg.arc()
                    .innerRadius(radius / 2)
                    .outerRadius(radius);

                
                var pie = d3.layout.pie()
                    .value(function(d) { return +d.count; })
                    .sort(function(a, b) { return b.count - a.count; });



                
                
                

                
                svg.append("text")
                    .attr("class", "d3-text")
                    .attr("dy", ".35em")
                    .style("text-anchor", "middle")
                    .style("font-weight", 500)
                    .text(function(d) { return d.key; });


                
                var g = svg.selectAll("g")
                    .data(function(d) { return pie(d.values); })
                    .enter()
                    .append("g")
                        .attr("class", "d3-arc");


                
                g.append("path")
                    .attr("d", arc)
                    .attr("class", "d3-slice-border")
                    .style("fill", function(d) { return slice_colors(d.data.carrier); })
                    .append("title")
                        .text(function(d) { return d.data.carrier + ": " + d.data.count; });


                
                g.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("text")
                    .attr("dy", ".35em")
                    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
                    .style("fill", slice_text_color)
                    .style("font-size", 12)
                    .style("text-anchor", "middle")
                    .text(function(d) { return d.data.carrier; });


                
                function angle(d) {
                    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
                    return a > 90 ? a - 180 : a;
                }
            });
        }
    };


    
    
    

    return {
        init: function() {
            _pieDonutMultipleNesting();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3PieDonutMultipleNesting.init();
});
