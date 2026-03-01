





var D3SunburstDistortion = function() {


    
    
    

    
    var _sunburstDistortion = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-sunburst-distortion'),
            width = 400,
            height = 400;


        
        if(element) {

            
            

            
            var radius = Math.min(width, height) / 2;
                color = d3.scale.category20c();



            
            

            var svg = d3.select(element).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



            
            

            
            var partition = d3.layout.partition()
                .size([2 * Math.PI, radius])
                .value(function(d) { return d.size; });

            
            var arc = d3.svg.arc()
                .startAngle(function(d) { return d.x; })
                .endAngle(function(d) { return d.x + d.dx; })
                .innerRadius(function(d) { return d.y; })
                .outerRadius(function(d) { return d.y + d.dy; });



            
            

            d3.json("../../../assets/demo/data/d3/sunburst/sunburst_basic.json", function(root) {

                
                path = svg.data([root]).selectAll("path")
                    .data(partition.nodes)
                    .enter()
                    .append("path")
                        .attr("class", "d3-slice-border")
                        .attr("d", arc)
                        .style("stroke-width", 1)
                        .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
                        .on("click", magnify)
                        .each(stash);
            });


            
            function magnify(node) {
                if (parent = node.parent) {
                    var parent,
                        x = parent.x,
                        k = .8;

                    parent.children.forEach(function(sibling) {
                        x += reposition(sibling, x, sibling === node
                        ? parent.dx * k / node.value
                        : parent.dx * (1 - k) / (parent.value - node.value));
                    });
                }
                else {
                    reposition(node, 0, node.dx / node.value);
                }

                path.transition()
                    .duration(750)
                    .attrTween("d", arcTween);
            }

            
            function reposition(node, x, k) {
                node.x = x;
                if (node.children && (n = node.children.length)) {
                    var i = -1, n;
                    while (++i < n) x += reposition(node.children[i], x, k);
                }
                return node.dx = node.value * k;
            }

            
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
            _sunburstDistortion();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3SunburstDistortion.init();
});
