





var D3VennTooltip = function() {


    
    
    

    
    var _vennTooltip = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-venn-tooltip');


        
        if(element) {

            
            

            
            var sets = [
                {label: 'SE', size: 28},
                {label: 'Treat', size: 35},
                {label: 'Anti-CCP', size: 108},
                {label: 'DAS28', size: 106}
            ];

            
            var overlaps = [
                {sets: [0,1], size: 1},
                {sets: [0,2], size: 1},
                {sets: [0,3], size: 14},
                {sets: [1,2], size: 6},
                {sets: [1,3], size: 0},
                {sets: [2,3], size: 1},
                {sets: [0,2,3], size: 1},
                {sets: [0,1,2], size: 0},
                {sets: [0,1,3], size: 0},
                {sets: [1,2,3], size: 0},
                {sets: [0,1,2,3], size: 0}
            ];


            
            

            
            var colours = d3.scale.category10();

            
            sets = venn.venn(sets, overlaps);

            
            var diagram = venn.drawD3Diagram(d3.select(element), sets, 350, 350);


            
            

            
            var tooltip = d3.select("body").append("div")
                .attr("class", "d3-tip");

            d3.selection.prototype.moveParentToFront = function() {
                return this.each(function(){
                    this.parentNode.parentNode.appendChild(this.parentNode);
                });
            };

            
            diagram.text
                .style("fill", "#fff")
                .style("font-weight", "500")
                .style("cursor", "pointer");

            
            diagram.circles
                .attr("class", "d3-slice-border")
                .style("stroke-opacity", 0)
                .style("fill-opacity", .75);


            
            diagram.nodes
                .on("mousemove", function() {
                    tooltip.style("left", (d3.event.pageX + 20) + "px")
                           .style("top", (d3.event.pageY - 15) + "px");
                })
                .on("mouseover", function(d, i) {
                    var selection = d3.select(this).select("circle");
                    selection.moveParentToFront()
                        .transition()
                        .style("fill-opacity", .75)
                        .style("cursor", "pointer")
                        .style("stroke-opacity", 1);

                    tooltip.transition().style("display", "block");
                    tooltip.text(d.size + " users");
                })
                .on("mouseout", function(d, i) {
                    d3.select(this).select("circle").transition()
                        .style("fill-opacity", .75)
                        .style("stroke-opacity", 0);

                    tooltip.transition().style("display", "none");
                });


                
                diagram.svg.selectAll("path")
                    .data(overlaps)
                    .enter()
                    .append("path")
                    .attr("d", function(d) { 
                        return venn.intersectionAreaPath(d.sets.map(function(j) { return sets[j]; })); 
                    })
                    .attr("class", "d3-slice-border")
                    .style("fill-opacity","0")
                    .style("stroke-opacity", 0)
                    .style("stroke-width", "2")
                    .on("mouseover", function(d, i) {
                        d3.select(this).transition()
                            .style("fill-opacity", .1)
                            .style("stroke-opacity", 1);

                        tooltip.transition().style("display", "block");
                        tooltip.text(d.size + " users");
                    })
                    .on("mouseout", function(d, i) {
                        d3.select(this).transition()
                            .style("fill-opacity", 0)
                            .style("stroke-opacity", 0);

                        tooltip.transition().style("display", "none");
                    })
                    .on("mousemove", function() {
                        tooltip.style("left", (d3.event.pageX + 20) + "px")
                               .style("top", (d3.event.pageY - 15) + "px");
                    });
        }
    };


    
    
    

    return {
        init: function() {
            _vennTooltip();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3VennTooltip.init();
});
