





var D3PieDonutTweenAnimation = function() {


    
    
    

    
    var _pieDonutTweenAnimation = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-donut-arc-tween'),
            radius = 120;


        
        if(element) {

            
            

            
            var τ = 2 * Math.PI;

            
            var color = "#7986CB";


            
            

            
            var container = d3.select(element).append("svg");

            
            var svg = container
                .attr("width", radius * 2)
                .attr("height", radius * 2)
                .append("g")
                    .attr("transform", "translate(" + radius + "," + radius + ")");


            
            

            
            var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(radius / 1.4)
                .startAngle(0);


            
            
            

            
            var background = svg.append("path")
                .datum({endAngle: τ})
                .attr("d", arc)
                .attr("class", "d3-state-empty");

            
            var foreground = svg.append("path")
                .datum({endAngle: .127 * τ})
                .style("fill", color)
                .attr("d", arc);

            
            setInterval(function() {
                foreground.transition()
                    .duration(750)
                    .call(arcTween, Math.random() * τ);
            }, 1500);

            
            
            function arcTween(transition, newAngle) {
                transition.attrTween("d", function(d) {

                    
                    var interpolate = d3.interpolate(d.endAngle, newAngle);

                    
                    return function(t) {

                        
                        d.endAngle = interpolate(t);

                        
                        return arc(d);
                    };
                });
            }
        }
    };


    
    
    

    return {
        init: function() {
            _pieDonutTweenAnimation();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3PieDonutTweenAnimation.init();
});
