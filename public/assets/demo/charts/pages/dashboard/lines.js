





var DashboardLines = function() {


    
    
    

    
    var _AppSalesLinesChart = function(element, height) {
        if (typeof d3 == 'undefined' || typeof d3.tip == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 30, bottom: 30, left: 50},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom;

            
            var tooltip = d3.tip()
                .attr('class', 'd3-tip')
                .html(function (d) {
                    return '<ul class="list-unstyled mb-1">' +
                        '<li>' + '<div class="fs-base my-1"><i class="ph-arrow-circle-left me-2"></i>' + d.name + ' app' + '</div>' + '</li>' +
                        '<li>' + 'Sales: &nbsp;' + '<span class="fw-semibold float-end">' + d.value + '</span>' + '</li>' +
                        '<li>' + 'Revenue: &nbsp; ' + '<span class="fw-semibold float-end">' + '$' + (d.value * 25).toFixed(2) + '</span>' + '</li>' + 
                    '</ul>';
                });

            
            var parseDate = d3.time.format('%Y/%m/%d').parse,
                formatDate = d3.time.format('%b %d, %y');

            
            var scale = ['#4CAF50', '#FF5722', '#5C6BC0'],
                color = d3.scale.ordinal().range(scale);


            
            

            
            var container = d3Container.append('svg');

            
            var svg = container
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                    .call(tooltip);


            
            

            var menu = document.getElementById('select_date');
            menu.addEventListener('change', change);


            
            

            d3.csv('../../../assets/demo/data/dashboard/app_sales.csv', function(error, data) {
                formatted = data;
                redraw();
            });


            
            

            
            var altKey;
            d3.select(window)
                .on('keydown', function() { altKey = d3.event.altKey; })
                .on('keyup', function() { altKey = false; });
        
            
            function change() {
              d3.transition()
                  .duration(altKey ? 7500 : 500)
                  .each(redraw);
            }



            
            

            function redraw() {

                
                

                
                var nested = d3.nest()
                    .key(function(d) { return d.type; })
                    .map(formatted)
                
                
                
                
                var series = menu.value;
                
                
                var data = nested[series];
                
                
                color.domain(d3.keys(data[0]).filter(function(key) { return (key !== 'date' && key !== 'type'); }));

                
                var linedata = color.domain().map(function(name) {
                    return {
                                name: name,
                                values: data.map(function(d) {
                                    return {name: name, date: parseDate(d.date), value: parseFloat(d[name], 10)};
                                })
                            };
                        });

                
                var line = d3.svg.line()
                    .x(function(d) { return x(d.date); })
                    .y(function(d) { return y(d.value); })
                    .interpolate('cardinal');



                
                

                
                var x = d3.time.scale()
                    .domain([
                        d3.min(linedata, function(c) { return d3.min(c.values, function(v) { return v.date; }); }),
                        d3.max(linedata, function(c) { return d3.max(c.values, function(v) { return v.date; }); })
                    ])
                    .range([0, width]);

                
                var y = d3.scale.linear()
                    .domain([
                        d3.min(linedata, function(c) { return d3.min(c.values, function(v) { return v.value; }); }),
                        d3.max(linedata, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
                    ])
                    .range([height, 0]);



                
                

                
                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
                    .tickPadding(8)
                    .ticks(d3.time.days)
                    .innerTickSize(4)
                    .tickFormat(d3.time.format('%a')); 

                
                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left')
                    .ticks(6)
                    .tickSize(0 -width)
                    .tickPadding(8);
                


                
                
                

                
                

                
                svg.append('g')
                    .attr('class', 'd3-axis d3-axis-horizontal')
                    .attr('transform', 'translate(0,' + height + ')');

                
                svg.append('g')
                    .attr('class', 'd3-axis d3-axis-vertical d3-axis-transparent d3-grid d3-grid-dashed');



                
                

                
                var lines = svg.selectAll('.app-sales-lines')
                    .data(linedata)
             
                
                var lineGroup = lines
                    .enter()
                    .append('g')
                        .attr('class', 'app-sales-lines')
                        .attr('id', function(d){ return d.name + '-line'; });

                
                lineGroup.append('path')
                    .attr('class', 'd3-line d3-line-medium')
                    .style('stroke', function(d) { return color(d.name); })
                    .style('opacity', 0)
                    .attr('d', function(d) { return line(d.values[0]); })
                    .transition()
                        .duration(500)
                        .delay(function(d, i) { return i * 200; })
                        .style('opacity', 1);
              


                
                

                var circles = lines.selectAll('circle')
                    .data(function(d) { return d.values; })
                    .enter()
                    .append('circle')
                        .attr('class', 'd3-line-circle d3-line-circle-medium')
                        .attr('cx', function(d,i){return x(d.date)})
                        .attr('cy',function(d,i){return y(d.value)})
                        .attr('r', 3)
                        .style('stroke', function(d) { return color(d.name); });

                
                circles
                    .style('opacity', 0)
                    .transition()
                        .duration(500)
                        .delay(500)
                        .style('opacity', 1);



                
                

                
                circles
                    .on('mouseover', function (d) {
                        tooltip.offset([-15, 0]).show(d);

                        
                        d3.select(this).transition().duration(250).attr('r', 4);
                    })
                    .on('mouseout', function (d) {
                        tooltip.hide(d);

                        
                        d3.select(this).transition().duration(250).attr('r', 3);
                    });

                
                
                lines.each(function (d) { 
                    d3.select(d3.select(this).selectAll('circle')[0][0])
                        .on('mouseover', function (d) {
                            tooltip.offset([0, 15]).direction('e').show(d);

                            
                            d3.select(this).transition().duration(250).attr('r', 4);
                        })
                        .on('mouseout', function (d) {
                            tooltip.direction('n').hide(d);

                            
                            d3.select(this).transition().duration(250).attr('r', 3);
                        });
                })

                
                
                lines.each(function (d) { 
                    d3.select(d3.select(this).selectAll('circle')[0][d3.select(this).selectAll('circle').size() - 1])
                        .on('mouseover', function (d) {
                            tooltip.offset([0, -15]).direction('w').show(d);

                            
                            d3.select(this).transition().duration(250).attr('r', 4);
                        })
                        .on('mouseout', function (d) {
                            tooltip.direction('n').hide(d);

                            
                            d3.select(this).transition().duration(250).attr('r', 3);
                        })
                })



                
                

                
                var lineUpdate = d3.transition(lines);
                
                
                lineUpdate.select('path')
                    .attr('d', function(d, i) { return line(d.values); });

                
                lineUpdate.selectAll('circle')
                    .attr('cy',function(d,i){return y(d.value)})
                    .attr('cx', function(d,i){return x(d.date)});

                
                d3.transition(svg)
                    .select('.d3-axis-vertical')
                    .call(yAxis);   

                
                d3.transition(svg)
                    .select('.d3-axis-horizontal')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis);



                
                

                
                var resizeAppSalesTimer;
                window.addEventListener('resize', function() {
                    clearTimeout(resizeAppSalesTimer);
                    resizeAppSalesTimer = setTimeout(function () {
                        appSalesResize();
                    }, 200);
                });

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', appSalesResize);
                    });
                }

                
                
                
                
                
                function appSalesResize() {

                    
                    

                    
                    width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;

                    
                    container.attr('width', width + margin.left + margin.right);

                    
                    svg.attr('width', width + margin.left + margin.right);

                    
                    x.range([0, width]);

                    
                    y.range([height, 0]);


                    
                    

                    
                    svg.select('.d3-axis-horizontal').call(xAxis);

                    
                    svg.select('.d3-axis-vertical').call(yAxis.tickSize(0-width));

                    
                    svg.selectAll('.d3-line').attr('d', function(d, i) { return line(d.values); });

                    
                    svg.selectAll('.d3-line-circle').attr('cx', function(d,i){return x(d.date)})
                }
            }
        }
    };

    
    var _DailyRevenueLineChart = function(element, height) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var dataset = [
                {
                    'date': '04/13/14',
                    'alpha': '60'
                }, {
                    'date': '04/14/14',
                    'alpha': '35'
                }, {
                    'date': '04/15/14',
                    'alpha': '65'
                }, {
                    'date': '04/16/14',
                    'alpha': '50'
                }, {
                    'date': '04/17/14',
                    'alpha': '65'
                }, {
                    'date': '04/18/14',
                    'alpha': '20'
                }, {
                    'date': '04/19/14',
                    'alpha': '60'
                }
            ];

            
            var d3Container = d3.select(element),
                margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom,
                padding = 20;

            
            var parseDate = d3.time.format('%m/%d/%y').parse,
                formatDate = d3.time.format('%a, %B %e');

            
            var lineColor = '#fff',
                guideColor = 'rgba(255,255,255,0.3)';



            
            

            var tooltip = d3.tip()
                .attr('class', 'd3-tip')
                .html(function (d) {
                    return '<ul class="list-unstyled mb-1">' +
                        '<li>' + '<div class="fs-base my-1"><i class="ph-check-circle me-2"></i>' + formatDate(d.date) + '</div>' + '</li>' +
                        '<li>' + 'Sales: &nbsp;' + '<span class="fw-semibold float-end">' + d.alpha + '</span>' + '</li>' +
                        '<li>' + 'Revenue: &nbsp; ' + '<span class="fw-semibold float-end">' + '$' + (d.alpha * 25).toFixed(2) + '</span>' + '</li>' + 
                    '</ul>';
                });



            
            

            
            var container = d3Container.append('svg');

            
            var svg = container
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                        .call(tooltip);



            
            

            dataset.forEach(function (d) {
                d.date = parseDate(d.date);
                d.alpha = +d.alpha;
            });



            
            

            
            var x = d3.time.scale()
                .range([padding, width - padding]);

            
            var y = d3.scale.linear()
                .range([height, 5]);



            
            

            
            x.domain(d3.extent(dataset, function (d) {
                return d.date;
            }));

            
            y.domain([0, d3.max(dataset, function (d) {
                return Math.max(d.alpha);
            })]);



            
            

            
            var line = d3.svg.line()
                .x(function(d) {
                    return x(d.date);
                })
                .y(function(d) {
                    return y(d.alpha)
                });



            
            
            

            
            

            
            var clip = svg.append('defs')
                .append('clipPath')
                .attr('id', 'clip-line-small');

            
            var clipRect = clip.append('rect')
                .attr('class', 'clip')
                .attr('width', 0)
                .attr('height', height);

            
            clipRect
                  .transition()
                      .duration(1000)
                      .ease('linear')
                      .attr('width', width);



            
            

            
            var path = svg.append('path')
                .attr({
                    'd': line(dataset),
                    'clip-path': 'url(#clip-line-small)',
                    'class': 'd3-line d3-line-medium'
                })
                .style('stroke', lineColor);

            
            svg.select('.line-tickets')
                .transition()
                    .duration(1000)
                    .ease('linear');



            
            

            
            var guide = svg.append('g')
                .selectAll('.d3-line-guides-group')
                .data(dataset);

            
            guide
                .enter()
                .append('line')
                    .attr('class', 'd3-line-guides')
                    .attr('x1', function (d, i) {
                        return x(d.date);
                    })
                    .attr('y1', function (d, i) {
                        return height;
                    })
                    .attr('x2', function (d, i) {
                        return x(d.date);
                    })
                    .attr('y2', function (d, i) {
                        return height;
                    })
                    .style('stroke', guideColor)
                    .style('stroke-dasharray', '4,2')
                    .style('shape-rendering', 'crispEdges');

            
            guide
                .transition()
                    .duration(1000)
                    .delay(function(d, i) { return i * 150; })
                    .attr('y2', function (d, i) {
                        return y(d.alpha);
                    });



            
            

            
            var points = svg.insert('g')
                .selectAll('.d3-line-circle')
                .data(dataset)
                .enter()
                .append('circle')
                    .attr('class', 'd3-line-circle d3-line-circle-medium')
                    .attr('cx', line.x())
                    .attr('cy', line.y())
                    .attr('r', 3)
                    .style('stroke', lineColor)
                    .style('fill', lineColor);



            
            points
                .style('opacity', 0)
                .transition()
                    .duration(250)
                    .ease('linear')
                    .delay(1000)
                    .style('opacity', 1);


            
            points
                .on('mouseover', function (d) {
                    tooltip.offset([-10, 0]).show(d);

                    
                    d3.select(this).transition().duration(250).attr('r', 4);
                })

                
                .on('mouseout', function (d) {
                    tooltip.hide(d);

                    
                    d3.select(this).transition().duration(250).attr('r', 3);
                });

            
            d3.select(points[0][0])
                .on('mouseover', function (d) {
                    tooltip.offset([0, 10]).direction('e').show(d);

                    
                    d3.select(this).transition().duration(250).attr('r', 4);
                })
                .on('mouseout', function (d) {
                    tooltip.direction('n').hide(d);

                    
                    d3.select(this).transition().duration(250).attr('r', 3);
                });

            
            d3.select(points[0][points.size() - 1])
                .on('mouseover', function (d) {
                    tooltip.offset([0, -10]).direction('w').show(d);

                    
                    d3.select(this).transition().duration(250).attr('r', 4);
                })
                .on('mouseout', function (d) {
                    tooltip.direction('n').hide(d);

                    
                    d3.select(this).transition().duration(250).attr('r', 3);
                })



            
            

            
            var resizeRevenueTimer;
            window.addEventListener('resize', function() {
                clearTimeout(resizeRevenueTimer);
                resizeRevenueTimer = setTimeout(function () {
                    revenueResize();
                }, 200);
            });

            
            var sidebarToggle = document.querySelectorAll('.sidebar-control');
            if (sidebarToggle) {
                sidebarToggle.forEach(function(togglers) {
                    togglers.addEventListener('click', revenueResize);
                });
            }

            
            
            
            
            
            function revenueResize() {

                
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;


                
                

                
                container.attr('width', width + margin.left + margin.right);

                
                svg.attr('width', width + margin.left + margin.right);

                
                x.range([padding, width - padding]);


                
                

                
                clipRect.attr('width', width);

                
                svg.selectAll('.d3-line').attr('d', line(dataset));

                
                svg.selectAll('.d3-line-circle').attr('cx', line.x());

                
                svg.selectAll('.d3-line-guides')
                    .attr('x1', function (d, i) {
                        return x(d.date);
                    })
                    .attr('x2', function (d, i) {
                        return x(d.date);
                    });
            }
        }
    };


    
    
    

    return {
        init: function() {
            _AppSalesLinesChart('#app_sales', 255);
            _DailyRevenueLineChart('#today-revenue', 50);
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DashboardLines.init();
});
