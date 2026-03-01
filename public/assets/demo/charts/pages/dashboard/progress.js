





var DashboardProgress = function() {


    
    
    

    
    var _ProgressRoundedChart = function(element, radius, border, color, end, iconClass, textTitle, textAverage) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var d3Container = d3.select(element),
                startPercent = 0,
                endPercent = end,
                twoPi = Math.PI * 2,
                formatPercent = d3.format('.0%'),
                boxSize = radius * 2;

            
            var count = Math.abs((endPercent - startPercent) / 0.01);

            
            var step = endPercent < startPercent ? -0.01 : 0.01;



            
            

            var svgWrapper = d3Container
                .append('div')
                .attr('class', 'position-relative');

            
            var container = svgWrapper.append('svg');

            
            var svg = container
                .attr('width', boxSize)
                .attr('height', boxSize)
                .append('g')
                    .attr('transform', 'translate(' + (boxSize / 2) + ',' + (boxSize / 2) + ')');



            
            

            
            var arc = d3.svg.arc()
                .startAngle(0)
                .innerRadius(radius)
                .outerRadius(radius - border);



            
            
            

            
            

            
            svg.append('path')
                .attr('class', 'd3-progress-background')
                .attr('d', arc.endAngle(twoPi))
                .style('fill', color)
                .style('opacity', 0.2);

            
            var foreground = svg.append('path')
                .attr('class', 'd3-progress-foreground')
                .attr('filter', 'url(#blur)')
                .style('fill', color)
                .style('stroke', color);

            
            var front = svg.append('path')
                .attr('class', 'd3-progress-front')
                .style('fill', color)
                .style('fill-opacity', 1);



            
            

            
            var numberText = d3.select(element)
                .append('h4')
                    .attr('class', 'pt-1 mt-2 mb-0')

            
            svgWrapper
                .append('i')
                    .attr('class', iconClass + ' counter-icon');

            
            d3.select(element)
                .append('div')
                    .text(textTitle);

            
            d3.select(element)
                .append('div')
                    .attr('class', 'fs-sm text-muted mb-3')
                    .text(textAverage);



            
            

            
            function updateProgress(progress) {
                foreground.attr('d', arc.endAngle(twoPi * progress));
                front.attr('d', arc.endAngle(twoPi * progress));
                numberText.text(formatPercent(progress));
            }

            
            var progress = startPercent;
            (function loops() {
                updateProgress(progress);
                if (count > 0) {
                    count--;
                    progress += step;
                    setTimeout(loops, 10);
                }
            })();
        }
    };


    
    
    

    return {
        init: function() {
            _ProgressRoundedChart('#hours-available-progress', 38, 2, '#F06292', 0.68, 'ph-check text-pink', 'Hours available', '64% average');
            _ProgressRoundedChart('#goal-progress', 38, 2, '#5C6BC0', 0.82, 'ph-trophy text-indigo', 'Productivity goal', '87% average');
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DashboardProgress.init();
});
