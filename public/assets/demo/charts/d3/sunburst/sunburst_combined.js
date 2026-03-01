





var D3SunburstCombined = function() {


    
    
    

    
    var _sunburstCombined = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-sunburst-combined'),
            width = 400,
            height = 400;


        
        if(element) {

            
            

            
            var radius = Math.min(width, height) / 2;



            
            

            
            var x = d3.scale.linear()
                .range([0, 2 * Math.PI]);

            
            var y = d3.scale.sqrt()
                .range([0, radius]);

            
            var color = d3.scale.category20();



            
            

            var svg = d3.select(element).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



            
            

            
            var partition = d3.layout.partition()
                .sort(null)
                .value(function(d) { return 1; });

            
            var arc = d3.svg.arc()
                .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
                .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
                .innerRadius(function(d) { return Math.max(0, y(d.y)); })
                .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });



            
            

            
            var node;

            d3.json("../../../assets/demo/data/d3/sunburst/sunburst_basic.json", function(error, root) {
                node = root;

                
                var path = svg.datum(root).selectAll(".d3-sunbirst")
                    .data(partition.nodes)
                    .enter()
                    .append("path")
                        .attr("class", "d3-sunbirst d3-slice-border")
                        .attr("d", arc)
                        .style("stroke-width", 1)
                        .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
                        .on("click", click)
                        .each(stash);

                
                d3.selectAll(".combined-options input").on("change", function change() {
                    var value = this.value === "count"
                    ? function() { return 1; }
                    : function(d) { return d.size; };

                    
                    path
                        .data(partition.value(value).nodes)
                        .transition()
                            .duration(750)
                            .attrTween("d", arcTweenData);
                });

                
                function click(d) {
                    node = d;
                    path.transition()
                        .duration(750)
                        .attrTween("d", arcTweenZoom(d));
                }
            });


            
            function stash(d) {
                d.x0 = d.x;
                d.dx0 = d.dx;
            }

            
            function arcTweenData(a, i) {
                var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
                function tween(t) {
                    var b = oi(t);
                    a.x0 = b.x;
                    a.dx0 = b.dx;
                    return arc(b);
                }
                if (i == 0) {
                    
                    
                    var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
                    return function(t) {
                        x.domain(xd(t));
                        return tween(t);
                    };
                }
                else {
                    return tween;
                }
            }

            
            function arcTweenZoom(d) {
                var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                    yd = d3.interpolate(y.domain(), [d.y, 1]),
                    yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);

                return function(d, i) {
                    return i
                    ? function(t) { return arc(d); }
                    : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
                };
            }
        }
    };


    
    
    

    return {
        init: function() {
            _sunburstCombined();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3SunburstCombined.init();
});
