





var D3PieBasic = function() {


    
    
    

    
    var _pieBasic = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-pie-basic'),
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
                .innerRadius(0);

            
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
                    .style("fill", function(d) { return pie_colors(d.data.age); });

                
                g.append("text")
                    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                    .attr("dy", ".35em")
                    .style("fill", pie_text_color)
                    .style("font-size", 12)
                    .style("text-anchor", "middle")
                    .text(function(d) { return d.data.age; });
            });
        }
    };


    
    
    

    return {
        init: function() {
            _pieBasic();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3PieBasic.init();
});
