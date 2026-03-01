





var D3VennBasic = function() {


    
    
    

    
    var _vennBasic = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-venn-basic');


        
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


            
            

            
            var colours = d3.scale.category20();

            
            var diagram = venn.drawD3Diagram(d3.select(element), venn.venn(sets, overlaps), 350, 350);

            
            diagram.circles
                .style("fill-opacity", .75)
                .style("fill", function(d,i) { return colours(i); })
                .style("stroke", function(d,i) { return colours(i); });


            
            diagram.text
                .style("fill", "#fff")
                .style("font-weight", "500");
        }
    };


    
    
    

    return {
        init: function() {
            _vennBasic();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3VennBasic.init();
});
