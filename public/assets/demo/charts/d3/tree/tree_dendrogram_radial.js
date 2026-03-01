





var D3TreeDendrogramRadial = function() {


    
    
    

    
    var _treeDendrogramRadial = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-dendrogram-radial'),
            diameter = 900;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element);

            
            var color = '#2196F3';


            
            

            
            var container = d3Container.append("svg");

            
            var svg = container
                .attr("width", diameter)
                .attr("height", diameter)
                .attr("class", "d-block m-auto")
                .append("g")
                    .attr("transform", "translate(" + (diameter / 2) + "," + (diameter / 2) + ")");



            
            

            
            var cluster = d3.layout.cluster()
                .size([360, (diameter / 2) - 150]);

            
            var diagonal = d3.svg.diagonal.radial()
                .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });


            
            

            d3.json("../../../assets/demo/data/d3/tree/tree_data_dendrogram_radial.json", function(error, root) {

                var nodes = cluster.nodes(root);


                
                

                
                var link = svg.selectAll(".d3-tree-link")
                    .data(cluster.links(nodes))
                    .enter()
                    .append("path")
                        .attr("class", "d3-tree-link d3-line-connect")
                        .attr("d", diagonal)
                        .style("stroke-width", 1.5);


                
                

                
                var node = svg.selectAll(".d3-tree-node")
                    .data(nodes)
                    .enter()
                    .append("g")
                        .attr("class", "d3-tree-node")
                        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

                
                node.append("circle")
                    .attr("r", 4.5)
                    .attr("class", "d3-line-circle")
                    .style("stroke", color)
                    .style("stroke-width", 1.5);

                
                node.append("text")
                    .attr("class", "d3-text")
                    .attr("dy", ".31em")
                    .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                    .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
                    .style("font-size", 12)
                    .text(function(d) { return d.name; });
            });
        }
    };


    
    
    

    return {
        init: function() {
            _treeDendrogramRadial();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3TreeDendrogramRadial.init();
});
