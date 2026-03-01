





var D3TreeCollapsible = function() {


    
    
    

    
    var _treeCollapsible = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-tree-collapsible'),
            height = 800;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 0, right: 0, bottom: 0, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5,
                i = 0,
                root;

            
            var color = '#2196F3';



            
            

            
            var container = d3Container.append("svg");

            
            var svg = container
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            
            

            
            var tree = d3.layout.tree()
                .size([height, width - 180]);

            
            var diagonal = d3.svg.diagonal()
                .projection(function(d) { return [d.y, d.x]; });



            
            

            d3.json("../../../assets/demo/data/d3/tree/tree_data_collapsible.json", function(error, json) {

                root = json;
                root.x0 = height/2;
                root.y0 = 0;

                
                function toggleAll(d) {
                    if (d.children) {
                        d.children.forEach(toggleAll);
                        toggle(d);
                    }
                }

                
                root.children.forEach(toggleAll);
                toggle(root.children[1]);
                toggle(root.children[1].children[2]);
                toggle(root.children[9]);
                toggle(root.children[9].children[0]);

                update(root);
            });



            
            

            
            function update(source) {

                
                var duration = d3.event && d3.event.altKey ? 5000 : 500;

                
                var nodes = tree.nodes(root).reverse();

                
                

                
                var node = svg.selectAll(".d3-tree-node")
                    .data(nodes, function(d) { return d.id || (d.id = ++i); });


                
                

                
                var nodeEnter = node.enter().append("g")
                    .attr("class", "d3-tree-node")
                    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                    .on("click", function(d) { toggle(d); update(d); });

                
                nodeEnter.append("circle")
                    .attr("class", "d3-line-circle")
                    .attr("r", 1e-6)
                    .style("stroke", color)
                    .style("stroke-width", 1.5)
                    .style("cursor", "pointer")
                    .style("fill", function(d) { return d._children && color; });

                
                nodeEnter.append("text")
                    .attr("class", "d3-text")
                    .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
                    .attr("dy", ".35em")
                    .style("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                    .style("font-size", 12)
                    .style("fill-opacity", 1e-6)
                    .text(function(d) { return d.name; });


                
                

                
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

                
                nodeUpdate.select("circle")
                    .attr("r", 4.5)
                    .style("fill", function(d) { return d._children && color; });

                
                nodeUpdate.select("text")
                    .style("fill-opacity", 1);


                
                

                
                var nodeExit = node.exit()
                    .transition()
                        .duration(duration)
                        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                        .remove();

                
                nodeExit.select("circle")
                    .attr("r", 1e-6);

                
                nodeExit.select("text")
                    .style("fill-opacity", 1e-6);


                
                

                
                var link = svg.selectAll(".d3-tree-link")
                    .data(tree.links(nodes), function(d) { return d.target.id; });

                
                link.enter().insert("path", "g")
                    .attr("class", "d3-tree-link d3-line-connect")
                    .style("fill", "none")
                    .style("stroke-width", 1.5)
                    .attr("d", function(d) {
                        var o = {x: source.x0, y: source.y0};
                        return diagonal({source: o, target: o});
                    })
                    .transition()
                        .duration(duration)
                        .attr("d", diagonal);

                
                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);

                
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function(d) {
                    var o = {x: source.x, y: source.y};
                        return diagonal({source: o, target: o});
                    })
                    .remove();

                
                nodes.forEach(function(d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });


                
                

                
                window.addEventListener('resize', resize);

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', resize);
                    });
                }


                
                
                
                
                
                function resize() {

                    
                    width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                    nodes = tree.nodes(root),
                    links = tree.links(nodes);

                    
                    

                    
                    container.attr("width", width + margin.left + margin.right);

                    
                    svg.attr("width", width + margin.left + margin.right);


                    
                    tree.size([height, width - 180]);

                    diagonal.projection(function(d) { return [d.y, d.x]; });


                    
                    

                    
                    svg.selectAll(".d3-tree-link").attr("d", diagonal)

                    
                    svg.selectAll(".d3-tree-node").attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
                }
            }

            
            function toggle(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                }
                else {
                    d.children = d._children;
                    d._children = null;
                }
            }
        }
    };


    
    
    

    return {
        init: function() {
            _treeCollapsible();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3TreeCollapsible.init();
});
