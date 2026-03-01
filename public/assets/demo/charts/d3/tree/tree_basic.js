





var D3TreeBasic = function() {


    
    
    

    
    var _treeBasic = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-tree-basic'),
            height = 800;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 0, right: 0, bottom: 0, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
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



            
            

            d3.json("../../../assets/demo/data/d3/tree/tree_data_basic.json", function(error, json) {

                var nodes = tree.nodes(json),
                    links = tree.links(nodes);


                
                

                
                var linkGroup = svg.append("g")
                    .attr("class", "d3-tree-link-group");

                
                var link = linkGroup.selectAll(".d3-tree-link")
                    .data(links)
                    .enter()
                    .append("path")
                        .attr("class", "d3-tree-link d3-line-connect")
                        .style("stroke-width", 1.5)
                        .attr("d", diagonal);


                
                

                
                var nodeGroup = svg.append("g")
                    .attr("class", "d3-tree-node-group");

                
                var node = nodeGroup.selectAll(".d3-tree-node")
                    .data(nodes)
                    .enter()
                    .append("g")
                        .attr("class", "d3-tree-node")
                        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

                
                node.append("circle")
                    .attr("r", 4.5)
                    .attr("class", "d3-tree-circle d3-line-circle")
                    .style("stroke", color)
                    .style("stroke-width", 1.5);

                
                node.append("text")
                    .attr("class", "d3-text")
                    .attr("dx", function(d) { return d.children ? -12 : 12; })
                    .attr("dy", 4)
                    .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
                    .style("font-size", 12)
                    .text(function(d) { return d.name; });



                
                

                
                window.addEventListener('resize', resize);

                
            var sidebarToggle = document.querySelectorAll('.sidebar-control');
            if (sidebarToggle) {
                sidebarToggle.forEach(function(togglers) {
                    togglers.addEventListener('click', resize);
                });
            }


                
                
                
                
                
                function resize() {

                    
                    width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                    nodes = tree.nodes(json),
                    links = tree.links(nodes);

                    
                    

                    
                    container.attr("width", width + margin.left + margin.right);

                    
                    svg.attr("width", width + margin.left + margin.right);


                    
                    tree.size([height, width - 180]);


                    
                    

                    
                    svg.selectAll(".d3-tree-link").attr("d", diagonal)

                    
                    svg.selectAll(".d3-tree-node").attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
                }
            });
        }
    };


    
    
    

    return {
        init: function() {
            _treeBasic();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3TreeBasic.init();
});
