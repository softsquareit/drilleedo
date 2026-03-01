





var D3TreeBracket = function() {


    
    
    

    
    var _treeBracket = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-tree-bracket'),
            height = 600;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                halfWidth = width / 2,
                height = height - margin.top - margin.bottom - 5,
                i = 0,
                duration = 500,
                root;

            
            var color = '#2196F3';



            
            

            
            var container = d3Container.append("svg");

            
            var svg = container
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            
            var getChildren = function(d) {
                var a = [];
                if(d.winners) for(var i = 0; i < d.winners.length; i++){
                    d.winners[i].isRight = false;
                    d.winners[i].parent = d;
                    a.push(d.winners[i]);
                }
                if(d.challengers) for(var i = 0; i < d.challengers.length; i++){
                    d.challengers[i].isRight = true;
                    d.challengers[i].parent = d;
                    a.push(d.challengers[i]);
                }
                return a.length?a:null;
            };



            
            

            
            var zoom = d3.behavior.zoom()
                .scaleExtent([1,2])
                .on('zoom', function(){
                    svg.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
                });

            
            container.call(zoom);



            
            

            
            var tree = d3.layout.tree()
                .size([height, width]);

            
            var diagonal = d3.svg.diagonal()
                .projection(function(d) { return [d.y, d.x]; });



            
            

            
            var elbow = function (d, i){
                var source = calcLeft(d.source),
                    target = calcLeft(d.target),
                    hy = (target.y-source.y) / 2;

                    if(d.isRight) hy = -hy;
                    return "M" + source.y + "," + source.x + "H" + (source.y + hy) + "V" + target.x + "H" + target.y;
            };
            var connector = elbow;

            
            var calcLeft = function(d) {
                var l = d.y;
                if(!d.isRight) {
                    l = d.y-halfWidth;
                    l = halfWidth - l;
                }
                return {x : d.x, y : l};
            };

            var toArray = function(item, arr){
                arr = arr || [];
                var i = 0,
                l = item.children?item.children.length : 0;
                
                arr.push(item);
                for(; i < l; i++) {
                    toArray(item.children[i], arr);
                }
                return arr;
            };



            
            

            d3.json("../../../assets/demo/data/d3/tree/tree_bracket.json", function(json) {
                root = json;
                root.x0 = height / 2;
                root.y0 = width / 2;
                
                
                var t1 = d3.layout.tree().size([height, halfWidth]).children(function(d){return d.winners;}),
                    t2 = d3.layout.tree().size([height, halfWidth]).children(function(d){return d.challengers;});
                    t1.nodes(root);
                    t2.nodes(root);
      
                
                var rebuildChildren = function(node){
                    node.children = getChildren(node);
                    if(node.children) node.children.forEach(rebuildChildren);
                }
                rebuildChildren(root);
                root.isRight = false;
                update(root);
            });



            
            

            
            function update(source) {

                
                var nodes = toArray(source);

                
                nodes.forEach(function(d) { d.y = d.depth * 180 + halfWidth; });

                
                var node = svg.selectAll("g.node")
                    .data(nodes, function(d) { return d.id || (d.id = ++i); });

                
                nodes.forEach(function(d) {
                    var p = calcLeft(d);
                    d.x0 = p.x;
                    d.y0 = p.y;
                });


                
                

                
                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                    .on("click", click);    

                
                nodeEnter.append("circle")
                    .attr("r", 1e-6)
                    .attr("class", "d3-line-circle")
                    .style("stroke", color)
                    .style("stroke-width", 1.5)
                    .style("cursor", "pointer")
                    .style("fill", function(d) { return d._children && color; });

                
                nodeEnter.append("text")
                    .attr("class", "d3-text")
                    .attr("dy", function(d) { return d.isRight?18:-12;})
                    .attr("text-anchor", "middle")
                    .text(function(d) { return d.name; })
                    .style("font-size", 12)
                    .style("fill-opacity", 1e-6);


                
                

                
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function(d) { p = calcLeft(d); return "translate(" + p.y + "," + p.x + ")"; });

                
                nodeUpdate.select("circle")
                    .attr("r", 4.5)
                    .style("fill", function(d) { return d._children && color; });

                
                nodeUpdate.select("text")
                    .style("fill-opacity", 1);


                
                

                
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function(d) { p = calcLeft(d.parent||source); return "translate(" + p.y + "," + p.x + ")"; })
                    .remove();

                
                nodeExit.select("circle")
                    .attr("r", 1e-6);

                
                nodeExit.select("text")
                    .style("fill-opacity", 1e-6);



                
                

                
                var link = svg.selectAll("path.link")
                    .data(tree.links(nodes), function(d) { return d.target.id; });

                
                link.enter().insert("path", "g")
                    .attr("class", "link d3-line-connect")
                    .style("stroke-width", 1.5)
                    .attr("d", function(d) {
                        var o = {x: source.x0, y: source.y0};
                        return connector({source: o, target: o});
                    });

                
                link.transition()
                    .duration(duration)
                    .attr("d", connector);

                
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function(d) {
                        var o = calcLeft(d.source||source);
                        if(d.source.isRight) o.y -= halfWidth - (d.target.y - d.source.y);
                        else o.y += halfWidth - (d.target.y - d.source.y);
                        return connector({source: o, target: o});
                    })
                    .remove();



                
                function click(d) {
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;
                    }
                    update(source);
                }


                
                

                
                window.addEventListener('resize', resize);

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', resize);
                    });
                }


                
                
                
                
                
                function resize() {

                    
                    width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,

                    
                    

                    
                    container.attr("width", width + margin.left + margin.right);

                    
                    svg.attr("width", width + margin.left + margin.right);
                }
            }
        }
    };


    
    
    

    return {
        init: function() {
            _treeBracket();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3TreeBracket.init();
});
