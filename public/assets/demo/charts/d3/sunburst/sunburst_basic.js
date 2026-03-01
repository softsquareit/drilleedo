





var D3SunburstBasic = function() {


    
    
    

    
    var _sunburstBasic = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-sunburst-basic'),
            width = 400,
            height = 400;


        
        if(element) {

            
            

            
            var radius = Math.min(width, height) / 2,
                color = d3.scale.category20();



            
            

            var svg = d3.select(element).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



            
            

            
            var partition = d3.layout.partition()
                .sort(null)
                .size([2 * Math.PI, radius * radius])
                .value(function(d) { return 1; });

            
            var arc = d3.svg.arc()
                .startAngle(function(d) { return d.x; })
                .endAngle(function(d) { return d.x + d.dx; })
                .innerRadius(function(d) { return Math.sqrt(d.y); })
                .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });



            
            

            d3.json("../../../assets/demo/data/d3/sunburst/sunburst_basic.json", function(error, root) {

                
                var path = svg.datum(root).selectAll("path")
                    .data(partition.nodes)
                    .enter()
                    .append("path")
                        .attr("class", "d3-slice-border")
                        .attr("display", function(d) { return d.depth ? null : "none"; }) 
                        .attr("d", arc)
                        .style("stroke-width", 1)
                        .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
                        .style("fill-rule", "evenodd")
                        .each(stash);

                
                d3.selectAll(".basic-options input").on("change", function change() {
                    var value = this.value === "count"
                    ? function() { return 1; }
                    : function(d) { return d.size; };

                    
                    path.data(partition.value(value).nodes)
                        .transition()
                            .duration(750)
                            .attrTween("d", arcTween);
                });
            });


            
            function stash(d) {
                d.x0 = d.x;
                d.dx0 = d.dx;
            }

            
            function arcTween(a) {
                var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
                return function(t) {
                    var b = i(t);
                    a.x0 = b.x;
                    a.dx0 = b.dx;
                    return arc(b);
                };
            }
        }
    };


    
    
    

    return {
        init: function() {
            _sunburstBasic();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3SunburstBasic.init();
});
