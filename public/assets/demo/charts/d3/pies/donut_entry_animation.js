





var D3PieDonutEntryAnimation = function() {


    
    
    

    
    var _pieDonutEntryAnimation = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-donut-entry-animation'),
            radius = 120;


        
        if(element) {

            
            

            
            var pie_colors = d3.scale.category20(),
                pie_text_color = '#fff';


            
            

            
            var container = d3.select(element).append("svg");

            
            var svg = container
                .attr("width", radius * 2)
                .attr("height", radius * 2)
                .append("g")
                    .attr("transform", "translate(" + radius + "," + radius + ")");


            
            

            
            var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(radius / 1.75);

            
            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { return d.population; });


            
            

            d3.csv("../../../assets/demo/data/d3/pies/pies_basic.csv", function(error, data) {

                
                data.forEach(function(d) {
                    d.population = +d.population;
                });


                
                
                

                
                var g = svg.selectAll(".d3-arc")
                    .data(pie(data))
                    .enter()
                    .append("g")
                        .attr("class", "d3-arc");

                
                g.append("path")
                    .attr("d", arc)
                    .attr("class", "d3-slice-border")
                    .style("fill", function(d) { return pie_colors(d.data.age); })
                    .transition()
                        .ease("linear")
                        .duration(1000)
                        .attrTween("d", tweenPie);

                
                g.append("text")
                    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                    .attr("dy", ".35em")
                    .style("opacity", 0)
                    .style("fill", pie_text_color)
                    .style("text-anchor", "middle")
                    .text(function(d) { return d.data.age; })
                    .transition()
                        .ease("linear")
                        .delay(1000)
                        .duration(500)
                        .style("opacity", 1);


                
                function tweenPie(b) {
                    b.innerRadius = 0;
                    var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
                    return function(t) { return arc(i(t)); };
                }


                
                

                d3.select('.donut-animation').on('click', function () {

                    
                    svg.selectAll("path, text").remove();

                    
                    g.append("path")
                        .attr("d", arc)
                        .attr("class", "d3-slice-border")
                        .style("fill", function(d) { return pie_colors(d.data.age); })
                        .transition()
                            .ease("linear")
                            .duration(1000)
                            .attrTween("d", tweenPie);

                    
                    g.append("text")
                        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                        .style("opacity", 0)
                        .style("fill", pie_text_color)
                        .attr("dy", ".35em")
                        .style("text-anchor", "middle")
                        .text(function(d) { return d.data.age; })
                        .transition()
                            .ease("linear")
                            .delay(1000)
                            .duration(500)
                            .style("opacity", 1);
                });
            });
        }
    };


    
    
    

    return {
        init: function() {
            _pieDonutEntryAnimation();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3PieDonutEntryAnimation.init();
});
