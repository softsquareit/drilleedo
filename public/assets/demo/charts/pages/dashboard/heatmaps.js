





var DashboardHeatmaps = function() {


    
    
    

    
    var _AppSalesHeatmap = function(element) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {

            
            d3.csv('../../../assets/demo/data/dashboard/app_sales_heatmap.csv', function(error, data) {


                
                

                
                var nested_data = d3.nest().key(function(d) { return d.app; }),
                    nest = nested_data.entries(data);

                
                var format = d3.time.format('%Y/%m/%d %H:%M'),
                    formatTime = d3.time.format('%H:%M');

                
                data.forEach(function(d, i) { 
                    d.date = format.parse(d.date),
                    d.value = +d.value
                });



                
                

                
                var d3Container = d3.select(element);
                    margin = { top: 20, right: 0, bottom: 30, left: 0 },
                    width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                    gridSize = width / new Date(data[data.length - 1].date).getHours(), 
                    rowGap = 40, 
                    height = (rowGap + gridSize) * (d3.max(nest, function(d,i) {return i+1})) - margin.top,
                    buckets = 5, 
                    colors = ['#DCEDC8','#C5E1A5','#9CCC65','#7CB342','#558B2F'];



                
                

                
                var x = d3.time.scale().range([0, width]);

                
                var y = d3.scale.linear().range([height, 0]);

                
                var colorScale = d3.scale.quantile()
                    .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
                    .range(colors);



                
                

                
                x.domain([new Date(data[0].date), d3.time.hour.offset(new Date(data[data.length - 1].date), 1)]);

                
                y.domain([0, d3.max(data, function(d) { return d.app; })]);



                
                

                
                var container = d3Container.append('svg');

                
                var svg = container
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.bottom)
                    .append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');



                
                
                

                
                

                
                var hourGroup = svg.selectAll('.hour-group')
                    .data(nest)
                    .enter()
                    .append('g')
                        .attr('class', 'hour-group')
                        .attr('transform', function(d, i) { return 'translate(0, ' + ((gridSize + rowGap) * i) +')'; });

                
                hourGroup
                    .append('text')
                        .attr('class', 'd3-text')
                        .attr('x', 0)
                        .attr('y', -(margin.top/2))
                        .text(function (d, i) { return d.key; });

                
                hourGroup
                    .append('text')
                        .attr('class', 'sales-count d3-text')
                        .attr('x', width)
                        .attr('y', -(margin.top/2))
                        .style('text-anchor', 'end')
                        .text(function (d, i) { return d3.sum(d.values, function(d) { return d.value; }) + ' sales today' });



                
                

                
                var heatMap = hourGroup.selectAll('.heatmap-hour')
                    .data(function(d) {return d.values})
                    .enter()
                    .append('rect')
                        .attr('x', function(d,i) { return x(d.date); })
                        .attr('y', 0)
                        .attr('class', 'heatmap-hour d3-slice-border d3-bg')
                        .attr('width', gridSize)
                        .attr('height', gridSize)
                        .style('cursor', 'pointer');

                
                heatMap.transition()
                    .duration(250)
                    .delay(function(d, i) { return i * 20; })
                    .style('fill', function(d) { return colorScale(d.value); })

                
                hourGroup.each(function(d) {
                    heatMap
                        .on('mouseover', function (d, i) {
                            d3.select(this).style('opacity', 0.75);
                            d3.select(this.parentNode).select('.sales-count').text(function(d) { return d.values[i].value + ' sales at ' + formatTime(d.values[i].date); })
                        })
                        .on('mouseout', function (d, i) {
                            d3.select(this).style('opacity', 1);
                            d3.select(this.parentNode).select('.sales-count').text(function (d, i) { return d3.sum(d.values, function(d) { return d.value; }) + ' sales today' })
                        })
                })



                
                

                
                var minValue, maxValue;
                data.forEach(function(d, i) { 
                    maxValue = d3.max(data, function (d) { return d.value; });
                    minValue = d3.min(data, function (d) { return d.value; });
                });

                
                var legendGroup = svg.append('g')
                    .attr('class', 'legend-group')
                    .attr('width', width)
                    .attr('transform', 'translate(' + ((width/2) - ((buckets * gridSize))/2) + ',' + (height + (margin.bottom - margin.top)) + ')');

                
                var legend = legendGroup.selectAll('.heatmap-legend')
                    .data([0].concat(colorScale.quantiles()), function(d) { return d; })
                    .enter()
                    .append('g')
                        .attr('class', 'heatmap-legend');

                
                legend.append('rect')
                    .attr('class', 'heatmap-legend-item d3-slice-border')
                    .attr('x', function(d, i) { return gridSize * i; })
                    .attr('y', -8)
                    .attr('width', gridSize)
                    .attr('height', 5)
                    .style('stroke-width', 1)
                    .style('fill', function(d, i) { return colors[i]; });

                
                legendGroup.append('text')
                    .attr('class', 'min-legend-value d3-text')
                    .attr('x', -10)
                    .attr('y', -2)
                    .style('text-anchor', 'end')
                    .style('font-size', 12)
                    .text(minValue);

                
                legendGroup.append('text')
                    .attr('class', 'max-legend-value d3-text')
                    .attr('x', (buckets * gridSize) + 10)
                    .attr('y', -2)
                    .style('font-size', 12)
                    .text(maxValue);



                
                

                
                var resizeHeatmapTimer;
                window.addEventListener('resize', function() {
                    clearTimeout(resizeHeatmapTimer);
                    resizeHeatmapTimer = setTimeout(function () {
                        resizeHeatmap();
                    }, 200);
                });

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', resizeHeatmap);
                    });
                }

                
                
                
                
                
                function resizeHeatmap() {

                    
                    

                    
                    width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,

                    
                    gridSize = width / new Date(data[data.length - 1].date).getHours(),

                    
                    height = (rowGap + gridSize) * (d3.max(nest, function(d,i) {return i+1})) - margin.top,

                    
                    container.attr('width', width + margin.left + margin.right).attr('height', height + margin.bottom);

                    
                    svg.attr('width', width + margin.left + margin.right).attr('height', height + margin.bottom);

                    
                    x.range([0, width]);


                    
                    

                    
                    svg.selectAll('.hour-group')
                        .attr('transform', function(d, i) { return 'translate(0, ' + ((gridSize + rowGap) * i) +')'; });

                    
                    svg.selectAll('.heatmap-hour')
                        .attr('width', gridSize)
                        .attr('height', gridSize)
                        .attr('x', function(d,i) { return x(d.date); });

                    
                    svg.selectAll('.legend-group')
                        .attr('transform', 'translate(' + ((width/2) - ((buckets * gridSize))/2) + ',' + (height + margin.bottom - margin.top) + ')');

                    
                    svg.selectAll('.sales-count')
                        .attr('x', width);

                    
                    svg.selectAll('.heatmap-legend-item')
                        .attr('width', gridSize)
                        .attr('x', function(d, i) { return gridSize * i; });

                    
                    svg.selectAll('.max-legend-value')
                        .attr('x', (buckets * gridSize) + 10);
                }
            });
        }
    };


    
    
    

    return {
        init: function() {
            _AppSalesHeatmap('#sales-heatmap');
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DashboardHeatmaps.init();
});
