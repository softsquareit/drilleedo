





var D3PieUpdateAnimation = function() {


    
    
    

    
    var _pieUpdateAnimation = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-pie-update'),
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
                .innerRadius(0);

            
            var pie = d3.layout.pie()
                .value(function(d) { return d.apples; })
                .sort(null);


            
            

            d3.tsv("../../../assets/demo/data/d3/pies/pies_update.tsv", function(error, data) {

                
                data.forEach(function(d) {
                    d.apples = +d.apples || 0;
                    d.oranges = +d.oranges || 0;
                });


                
                
                

                
                var path = svg.datum(data)
                    .selectAll("path")
                    .data(pie)
                    .enter()
                    .append("path")
                        .attr("d", arc)
                        .attr("class", "d3-slice-border")
                        .style("fill", function(d, i) { return color(i); })
                        .each(function(d) { this._current = d; }); 


                
                d3.selectAll(".pie-radios input").on("change", change);

                
                var timeout = setTimeout(function() {
                    d3.select("input[value=\"oranges\"]").property("checked", true).each(change);
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
            _pieUpdateAnimation();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3PieUpdateAnimation.init();
});
