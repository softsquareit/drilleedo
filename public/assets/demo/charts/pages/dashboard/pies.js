





var DashboardPies = function() {


    
    
    

    
    var _ProgressPieChart = function(element, width, height, color) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var d3Container = d3.select(element),
                border = 2,
                radius = Math.min(width / 2, height / 2) - border,
                twoPi = 2 * Math.PI,
                progress = document.querySelector(element).dataset.progress,
                total = 100;

            
            

            
            var arc = d3.svg.arc()
                .startAngle(0)
                .innerRadius(0)
                .outerRadius(radius)
                .endAngle(function(d) {
                  return (d.value / d.size) * 2 * Math.PI; 
                })



            
            

            
            var container = d3Container.append('svg');

            
            var svg = container
                .attr('width', width)
                .attr('height', height)
                .append('g')
                    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');



            
            
            

            
            var meter = svg.append('g')
                .attr('class', 'progress-meter');

            
            meter.append('path')
                .attr('d', arc.endAngle(twoPi))
                .style('fill', 'none')
                .style('stroke', color)
                .style('stroke-width', 1.5);

            
            var foreground = meter.append('path')
                .style('fill', color);

            
            foreground
                .transition()
                    .ease('cubic-out')
                    .duration(2500)
                    .attrTween('d', arcTween);


            
            function arcTween() {
                var i = d3.interpolate(0, progress);
                return function(t) {
                    var currentProgress = progress / (100/t);
                    var endAngle = arc.endAngle(twoPi * (currentProgress));
                    return arc(i(endAngle));
                };
            }
        }
    };


    
    
    

    return {
        init: function() {
            _ProgressPieChart('#today-progress', 20, 20, '#7986CB');
            _ProgressPieChart('#yesterday-progress', 20, 20, '#7986CB');
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DashboardPies.init();
});
