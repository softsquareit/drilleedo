





var D3PieMultiple = function() {


    
    
    

    
    var _pieMultiple = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-pie-multiple'),
            radius = 110,
            margin = 10;


        
        if(element) {

            
            

            
            var data = [
                [11975,  5871, 8916, 2868],
                [ 1951, 10048, 2060, 6171],
                [ 8010, 16145, 8090, 8045],
                [ 1013,   990,  940, 6907]
            ];

            
            var colors = d3.scale.category20();


            
            

            
            var svg = d3.select(element)
                .selectAll("svg")
                .data(data)
                .enter()
                .append("svg")
                    .attr("width", (radius + margin) * 2)
                    .attr("height", (radius + margin) * 2)
                    .append("g")
                        .attr("class", "d3-arc")
                        .attr("transform", "translate(" + (radius + margin) + "," + (radius + margin) + ")");


            
            

            
            var arc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(radius);


            
            
            

            
            svg.selectAll("path")
                .data(d3.layout.pie())
                .enter()
                .append("path")
                    .attr("d", arc)
                    .attr("class", "d3-slice-border")
                    .style("fill", function(d, i) { return colors(i); });

        }
    };


    
    
    

    return {
        init: function() {
            _pieMultiple();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3PieMultiple.init();
});
