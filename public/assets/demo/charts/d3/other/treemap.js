





var D3Treemap = function() {


    
    
    

    
    var _treemap = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-treemap'),
            height = 800;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                width = d3Container.node().getBoundingClientRect().width,
                root,
                node;

            
            var color = d3.scale.category20(),
                text_color = '#fff'



            
            

            
            var x = d3.scale.linear()
                .range([0, width]);

            
            var y = d3.scale.linear().range([0, height]);


        
            
            

            
            var container = d3Container.append("svg");

            
            var svg = container
                .attr("width", width)
                .attr("height", height)
                .append("g")
                    .attr("transform", "translate(.5,.5)")
                    .style("font-size", 12)
                    .style("overflow", "hidden")
                    .style("text-indent", 2);



            
            

            
            var treemap = d3.layout.treemap()
                .round(false)
                .size([width, height])
                .sticky(true)
                .value(function(d) { return d.size; });



            
            

            d3.json("../../../assets/demo/data/d3/other/treemap.json", function(data) {
                node = root = data;
                var nodes = treemap.nodes(root)
                    .filter(function(d) { return !d.children; });


                
                

                
                var cell = svg.selectAll(".d3-treemap-cell")
                    .data(nodes)
                    .enter()
                    .append("g")
                        .attr("class", "d3-treemap-cell")
                        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                        .style("cursor", "pointer")
                        .on("click", function(d) { return zoom(node == d.parent ? root : d.parent); });

                
                cell.append("rect")
                    .attr("width", function(d) { return d.dx - 1; })
                    .attr("height", function(d) { return d.dy - 1; })
                    .style("fill", function(d, i) { return color(i); });

                
                cell.append("text")
                    .attr("x", function(d) { return d.dx / 2; })
                    .attr("y", function(d) { return d.dy / 2; })
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle")
                    .text(function(d) { return d.name; })
                    .style("fill", text_color)
                    .style("opacity", function(d) { d.width = this.getComputedTextLength(); return d.dx > d.width ? 1 : 0; });
            }); 


            
            

            d3.selectAll(".treemap-actions").on("change", change);

            
            function change() {
                treemap.value(this.value == "size" ? size : count).nodes(root);
                zoom(node);
            }

            
            function size(d) {
                return d.size;
            }

            
            function count(d) {
                return 1;
            }

            
            function zoom(d) {
                var kx = width / d.dx, ky = height / d.dy;
                x.domain([d.x, d.x + d.dx]);
                y.domain([d.y, d.y + d.dy]);

            
            var t = svg.selectAll(".d3-treemap-cell").transition()
                .duration(500)
                .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

                
                t.select("rect")
                    .attr("width", function(d) { return kx * d.dx - 1; })
                    .attr("height", function(d) { return ky * d.dy - 1; })

                
                t.select("text")
                    .attr("x", function(d) { return kx * d.dx / 2; })
                    .attr("y", function(d) { return ky * d.dy / 2; })
                    .style("opacity", function(d) { return kx * d.dx > d.width ? 1 : 0; });

                node = d;
                d3.event.stopPropagation();
            }

            
            d3.select(window).on("click", function() { zoom(root); });



            
            

            
            d3.select(window).on('resize', resize);

            
            d3.selectAll('.sidebar-control').on('click', resize);

            
            
            
            
            
            function resize() {

                
                width = d3Container.node().getBoundingClientRect().width;


                
                

                
                container.attr("width", width);

                
                svg.attr("width", width);


                
                x.range([0, width]);

                
                zoom(root);
            }
        }
    };


    
    
    

    return {
        init: function() {
            _treemap();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3Treemap.init();
});
