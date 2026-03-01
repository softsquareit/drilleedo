





var D3PieDonutUpdateAnimation = function() {


    
    
    

    
    var _pieDonutUpdateAnimation = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-donut-update'),
            radius = 120;


        
        if(element) {

            
            

            
            var color = d3.scale.category20c();


            
            

            
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
                .value(function(d) { return d.lemons; })
                .sort(null);


            
            

            d3.tsv("../../../assets/demo/data/d3/pies/donuts_update.tsv", function(error, data) {

                
                data.forEach(function(d) {
                    d.lemons = +d.lemons || 0;
                    d.melons = +d.melons || 0;
                });


                
                
                

                
                var path = svg.datum(data).selectAll("path")
                    .data(pie)
                    .enter()
                    .append("path")
                        .attr("fill", function(d, i) { return color(i); })
                        .attr("d", arc)
                        .attr("class", "d3-slice-border")
                        .each(function(d) { this._current = d; }); 

                
                d3.selectAll(".donut-radios input").on("change", change);

                
                var timeout = setTimeout(function() {
                    d3.select("input[value=\"melons\"]").property("checked", true).each(change);
                }, 2000);

                
                function change() {
                    var value = this.value;
                    clearTimeout(timeout);
                    pie.value(function(d) { return d[value]; }); 
                    path = path.data(pie); 
                    path.transition().duration(750).attrTween("d", arcTween); 
                }
            });


            
            
            
            function arcTween(a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function(t) {
                    return arc(i(t));
                };
            }
        }
    };


    
    
    

    return {
        init: function() {
            _pieDonutUpdateAnimation();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3PieDonutUpdateAnimation.init();
});
