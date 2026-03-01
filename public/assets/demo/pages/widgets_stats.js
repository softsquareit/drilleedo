





var StatisticWidgets = function() {


    
    
    

    
    var _areaChartWidget = function(element, chartHeight, color) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var d3Container = d3.select(element),
                margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = chartHeight - margin.top - margin.bottom;

            
            var parseDate = d3.time.format('%Y-%m-%d').parse;


            
            

            
            var container = d3Container.append('svg');

            
            var svg = container
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            
            

            
            var area = d3.svg.area()
                .x(function(d) { return x(d.date); })
                .y0(height)
                .y1(function(d) { return y(d.value); })
                .interpolate('monotone');


            
            

            
            var x = d3.time.scale().range([0, width ]);

            
            var y = d3.scale.linear().range([height, 0]);


            
            

            d3.json("../../../assets/demo/data/dashboard/monthly_sales.json", function (error, data) {

                
                if (error) return console.error(error);

                
                data.forEach(function (d) {
                    d.date = parseDate(d.date);
                    d.value = +d.value;
                });

                
                var maxY = d3.max(data, function(d) { return d.value; });

                
                var startData = data.map(function(datum) {
                    return {
                        date: datum.date,
                        value: 0
                    };
                });


                
                

                
                x.domain(d3.extent(data, function(d, i) { return d.date; }));

                
                y.domain([0, d3.max( data, function(d) { return d.value; })]);



                
                
                

                
                svg.append("path")
                    .datum(data)
                    .attr("class", "d3-area")
                    .style('fill', color)
                    .attr("d", area)
                    .transition() 
                        .duration(1000)
                        .attrTween('d', function() {
                            var interpolator = d3.interpolateArray(startData, data);
                            return function (t) {
                                return area(interpolator (t));
                            };
                        });


                
                

                
                window.addEventListener('resize', messagesAreaResize);

                
                var sidebarToggle = document.querySelector('.sidebar-control');
                sidebarToggle && sidebarToggle.addEventListener('click', messagesAreaResize);

                
                
                
                
                
                function messagesAreaResize() {

                    
                    width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;


                    
                    

                    
                    container.attr("width", width + margin.left + margin.right);

                    
                    svg.attr("width", width + margin.left + margin.right);

                    
                    x.range([0, width]);


                    
                    

                    
                    svg.selectAll('.d3-area').datum(data).attr("d", area);
                }
            });
        }
    };

    
    var _barChartWidget = function(element, barQty, height, animate, easing, duration, delay, color, tooltip) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var bardata = [];
            for (var i=0; i < barQty; i++) {
                bardata.push(Math.round(Math.random() * 10) + 10);
            }

            
            var d3Container = d3.select(element),
                width = d3Container.node().getBoundingClientRect().width;
            


            
            

            
            var x = d3.scale.ordinal()
                .rangeBands([0, width], 0.3);

            
            var y = d3.scale.linear()
                .range([0, height]);



            
            

            
            x.domain(d3.range(0, bardata.length));

            
            y.domain([0, d3.max(bardata)]);



            
            

            
            var container = d3Container.append('svg');

            
            var svg = container
                .attr('width', width)
                .attr('height', height)
                .append('g');



            
            
            

            
            var bars = svg.selectAll('rect')
                .data(bardata)
                .enter()
                .append('rect')
                    .attr('class', 'd3-random-bars')
                    .attr('width', x.rangeBand())
                    .attr('x', function(d,i) {
                        return x(i);
                    })
                    .style('fill', color);



            
            

            
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0]);

            
            if(tooltip == "hours" || tooltip == "goal" || tooltip == "members") {
                bars.call(tip)
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
            }

            
            if(tooltip == "hours") {
                tip.html(function (d, i) {
                    return "<div class='text-center'>" +
                            "<h6 class='mb-0'>" + d + "</h6>" +
                            "<span class='fs-size-sm'>meetings</span>" +
                            "<div class='fs-size-sm'>" + i + ":00" + "</div>" +
                        "</div>";
                });
            }

            
            if(tooltip == "goal") {
                tip.html(function (d, i) {
                    return "<div class='text-center'>" +
                            "<h6 class='mb-0'>" + d + "</h6>" +
                            "<span class='fs-size-sm'>statements</span>" +
                            "<div class='fs-size-sm'>" + i + ":00" + "</div>" +
                        "</div>";
                });
            }

            
            if(tooltip == "members") {
                tip.html(function (d, i) {
                    return "<div class='text-center'>" +
                            "<h6 class='mb-0'>" + d + "0" + "</h6>" +
                            "<span class='fs-size-sm'>members</span>" +
                            "<div class='fs-size-sm'>" + i + ":00" + "</div>" +
                        "</div>";
                });
            }



            
            

            
            if(animate) {
                withAnimation();
            } else {
                withoutAnimation();
            }

            
            function withAnimation() {
                bars
                    .attr('height', 0)
                    .attr('y', height)
                    .transition()
                        .attr('height', function(d) {
                            return y(d);
                        })
                        .attr('y', function(d) {
                            return height - y(d);
                        })
                        .delay(function(d, i) {
                            return i * delay;
                        })
                        .duration(duration)
                        .ease(easing);
            }

            
            function withoutAnimation() {
                bars
                    .attr('height', function(d) {
                        return y(d);
                    })
                    .attr('y', function(d) {
                        return height - y(d);
                    });
            }



            
            

            
            window.addEventListener('resize', barsResize);

            
            var sidebarToggle = document.querySelector('.sidebar-control');
            sidebarToggle && sidebarToggle.addEventListener('click', barsResize);

            
            
            
            
            
            function barsResize() {

                
                width = d3Container.node().getBoundingClientRect().width;


                
                

                
                container.attr("width", width);

                
                svg.attr("width", width);

                
                x.rangeBands([0, width], 0.3);


                
                

                
                svg.selectAll('.d3-random-bars')
                    .attr('width', x.rangeBand())
                    .attr('x', function(d,i) {
                        return x(i);
                    });
            }
        }
    };

    
    var _lineChartWidget = function(element, chartHeight, lineColor, pathColor, pointerLineColor, pointerBgColor) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var dataset = [
                {
                    "date": "04/13/14",
                    "alpha": "60"
                }, {
                    "date": "04/14/14",
                    "alpha": "35"
                }, {
                    "date": "04/15/14",
                    "alpha": "65"
                }, {
                    "date": "04/16/14",
                    "alpha": "50"
                }, {
                    "date": "04/17/14",
                    "alpha": "65"
                }, {
                    "date": "04/18/14",
                    "alpha": "20"
                }, {
                    "date": "04/19/14",
                    "alpha": "60"
                }
            ];

            
            var d3Container = d3.select(element),
                margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = chartHeight - margin.top - margin.bottom,
                padding = 20;

            
            var parseDate = d3.time.format("%m/%d/%y").parse,
                formatDate = d3.time.format("%a, %B %e");


            
            

            var tooltip = d3.tip()
                .attr('class', 'd3-tip')
                .html(function (d) {
                    return "<ul class='list-unstyled mb-1'>" +
                        "<li>" + "<div class='fs-base my-1'><i class='ph-check me-2'></i>" + formatDate(d.date) + "</div>" + "</li>" +
                        "<li>" + "Sales: &nbsp;" + "<span class='fw-semibold float-end'>" + d.alpha + "</span>" + "</li>" +
                        "<li>" + "Revenue: &nbsp; " + "<span class='fw-semibold float-end'>" + "$" + (d.alpha * 25).toFixed(2) + "</span>" + "</li>" + 
                    "</ul>";
                });


            
            

            
            var container = d3Container.append('svg');

            
            var svg = container
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
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
                    return y(d.alpha);
                });


            
            
            

            
            

            
            var clip = svg.append("defs")
                .append("clipPath")
                .attr("id", "clip-line-small");

            
            var clipRect = clip.append("rect")
                .attr('class', 'clip')
                .attr("width", 0)
                .attr("height", height);

            
            clipRect
                  .transition()
                      .duration(1000)
                      .ease('linear')
                      .attr("width", width);


            
            

            
            var path = svg.append('path')
                .attr({
                    'd': line(dataset),
                    "clip-path": "url(#clip-line-small)",
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
                    .style('stroke', pathColor)
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
                    .attr("cx", line.x())
                    .attr("cy", line.y())
                    .attr("r", 3)
                    .style({
                        'stroke': pointerLineColor,
                        'fill': pointerBgColor
                    });

            
            points
                .style('opacity', 0)
                .transition()
                    .duration(250)
                    .ease('linear')
                    .delay(1000)
                    .style('opacity', 1);

            
            points
                .on("mouseover", function (d) {
                    tooltip.offset([-10, 0]).show(d);

                    
                    d3.select(this).transition().duration(250).attr('r', 4);
                })

                
                .on("mouseout", function (d) {
                    tooltip.hide(d);

                    
                    d3.select(this).transition().duration(250).attr('r', 3);
                });

            
            d3.select(points[0][0])
                .on("mouseover", function (d) {
                    tooltip.offset([0, 10]).direction('e').show(d);

                    
                    d3.select(this).transition().duration(250).attr('r', 4);
                })
                .on("mouseout", function (d) {
                    tooltip.direction('n').hide(d);

                    
                    d3.select(this).transition().duration(250).attr('r', 3);
                });

            
            d3.select(points[0][points.size() - 1])
                .on("mouseover", function (d) {
                    tooltip.offset([0, -10]).direction('w').show(d);

                    
                    d3.select(this).transition().duration(250).attr('r', 4);
                })
                .on("mouseout", function (d) {
                    tooltip.direction('n').hide(d);

                    
                    d3.select(this).transition().duration(250).attr('r', 3);
                });


            
            

            
            window.addEventListener('resize', lineChartResize);

            
            var sidebarToggle = document.querySelector('.sidebar-control');
            sidebarToggle && sidebarToggle.addEventListener('click', lineChartResize);

            
            
            
            
            
            function lineChartResize() {

                
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;


                
                

                
                container.attr("width", width + margin.left + margin.right);

                
                svg.attr("width", width + margin.left + margin.right);

                
                x.range([padding, width - padding]);


                
                

                
                clipRect.attr("width", width);

                
                svg.selectAll('.d3-line').attr("d", line(dataset));

                
                svg.selectAll('.d3-line-circle').attr("cx", line.x());

                
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

    
    var _sparklinesWidget = function(element, chartType, qty, chartHeight, interpolation, duration, interval, color) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var d3Container = d3.select(element),
                margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = chartHeight - margin.top - margin.bottom;


            
            var data = [];
            for (var i=0; i < qty; i++) {
                data.push(Math.floor(Math.random() * qty) + 5);
            }


            
            

            
            var x = d3.scale.linear().range([0, width]);

            
            var y = d3.scale.linear().range([height - 5, 5]);


            
            

            
            x.domain([1, qty - 3]);

            
            y.domain([0, qty]);
                

            
            

            
            var line = d3.svg.line()
                .interpolate(interpolation)
                .x(function(d, i) { return x(i); })
                .y(function(d, i) { return y(d); });

            
            var area = d3.svg.area()
                .interpolate(interpolation)
                .x(function(d,i) { 
                    return x(i); 
                })
                .y0(height)
                .y1(function(d) { 
                    return y(d); 
                });


            
            

            
            var container = d3Container.append('svg');

            
            var svg = container
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            
            

            
            var clip = svg.append("defs")
                .append("clipPath")
                .attr('id', function(d, i) { return "load-clip-" + element.substring(1); });

            
            var clips = clip.append("rect")
                .attr('class', 'load-clip')
                .attr("width", 0)
                .attr("height", height);

            
            clips
                .transition()
                    .duration(1000)
                    .ease('linear')
                    .attr("width", width);


            
            
            

            
            var path = svg.append("g")
                .attr("clip-path", function(d, i) { return "url(#load-clip-" + element.substring(1) + ")"; })
                .append("path")
                    .datum(data)
                    .attr("transform", "translate(" + x(0) + ",0)");

            
            if(chartType == "area") {
                path.attr("d", area).attr('class', 'd3-area').style("fill", color); 
            }
            else {
                path.attr("d", line).attr("class", "d3-line d3-line-medium").style('stroke', color); 
            }

            
            path
                .style('opacity', 0)
                .transition()
                    .duration(500)
                    .style('opacity', 1);



            
            

            setInterval(function() {

                
                data.push(Math.floor(Math.random() * qty) + 5);

                
                data.shift();

                update();

            }, interval);



            
            

            function update() {

                
                path
                    .attr("transform", null)
                    .transition()
                        .duration(duration)
                        .ease("linear")
                        .attr("transform", "translate(" + x(0) + ",0)");

                
                if(chartType == "area") {
                    path.attr("d", area).attr('class', 'd3-area').style("fill", color);
                }
                else {
                    path.attr("d", line).attr("class", "d3-line d3-line-medium").style('stroke', color);
                }
            }



            
            

            
            window.addEventListener('resize', resizeSparklines);

            
            var sidebarToggle = document.querySelector('.sidebar-control');
            sidebarToggle && sidebarToggle.addEventListener('click', resizeSparklines);

            
            
            
            
            
            function resizeSparklines() {

                
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;


                
                

                
                container.attr("width", width + margin.left + margin.right);

                
                svg.attr("width", width + margin.left + margin.right);

                
                x.range([0, width]);


                
                

                
                clips.attr("width", width);

                
                svg.select(".d3-line").attr("d", line);

                
                svg.select(".d3-area").attr("d", area);
            }
        }
    };

    
    var _progressIcon = function(element, radius, border, foregroundColor, end, iconClass) {
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


            
            

            
            var container = d3Container.append('svg');

            
            var svg = container
                .attr('width', boxSize)
                .attr('height', boxSize)
                .append('g')
                    .attr('transform', 'translate(' + (boxSize / 2) + ',' + (boxSize / 2) + ')');


            
            

            
            var arc = d3.svg.arc()
                .startAngle(0)
                .innerRadius(radius)
                .outerRadius(radius - border)
                .cornerRadius(20);


            
            
            

            
            

            
            svg.append('path')
                .attr('class', 'd3-progress-background')
                .attr('d', arc.endAngle(twoPi))
                .style('fill', foregroundColor)
                .style('opacity', 0.1);

            
            var foreground = svg.append('path')
                .attr('class', 'd3-progress-foreground')
                .attr('filter', 'url(#blur)')
                .style({
                    'fill': foregroundColor,
                    'stroke': foregroundColor
                });

            
            var front = svg.append('path')
                .attr('class', 'd3-progress-front')
                .style({
                    'fill': foregroundColor,
                    'fill-opacity': 1
                });


            
            

            
            var numberText = d3.select('.progress-percentage')
                    .attr('class', 'pt-1 mt-2 mb-1');

            
            d3.select(element)
                .append("i")
                    .attr("class", iconClass + " counter-icon")
                    .style({
                        'color': foregroundColor
                    });


            
            

            
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

    
    var _progressPercentage = function(element, radius, border, foregroundColor, end) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var d3Container = d3.select(element),
                startPercent = 0,
                fontSize = 22,
                endPercent = end,
                twoPi = Math.PI * 2,
                formatPercent = d3.format('.0%'),
                boxSize = radius * 2;

            
            var count = Math.abs((endPercent - startPercent) / 0.01);

            
            var step = endPercent < startPercent ? -0.01 : 0.01;


            
            

            
            var container = d3Container.append('svg');

            
            var svg = container
                .attr('width', boxSize)
                .attr('height', boxSize)
                .append('g')
                    .attr('transform', 'translate(' + radius + ',' + radius + ')');


            
            

            
            var arc = d3.svg.arc()
                .startAngle(0)
                .innerRadius(radius)
                .outerRadius(radius - border)
                .cornerRadius(20);


            
            
            

            
            

            
            svg.append('path')
                .attr('class', 'd3-progress-background')
                .attr('d', arc.endAngle(twoPi))
                .style('fill', foregroundColor)
                .style('opacity', 0.1);

            
            var foreground = svg.append('path')
                .attr('class', 'd3-progress-foreground')
                .attr('filter', 'url(#blur)')
                .style({
                    'fill': foregroundColor,
                    'stroke': foregroundColor
                });

            
            var front = svg.append('path')
                .attr('class', 'd3-progress-front')
                .style({
                    'fill': foregroundColor,
                    'fill-opacity': 1
                });


            
            

            
            var numberText = svg
                .append('text')
                    .attr('dx', 0)
                    .attr('dy', (fontSize / 2) - border)
                    .style({
                        'font-size': fontSize + 'px',
                        'line-height': 1,
                        'fill': foregroundColor,
                        'text-anchor': 'middle'
                    });


            
            

            
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

    
    var _animatedPie = function(element, size) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {

            
            var data = [
                {
                    "status": "Pending tickets",
                    "icon": "<i class='ph-clock-counter-clockwise text-primary me-2'></i>",
                    "value": 938,
                    "color": "#29B6F6"
                }, {
                    "status": "Resolved tickets",
                    "icon": "<i class='ph-check text-success me-2'></i>",
                    "value": 490,
                    "color": "#66BB6A"
                }, {
                    "status": "Closed tickets",
                    "icon": "<i class='ph-x text-danger me-2'></i>",
                    "value": 789,
                    "color": "#EF5350"
                }
            ];

            
            var d3Container = d3.select(element),
                distance = 2, 
                radius = (size/2) - distance,
                sum = d3.sum(data, function(d) { return d.value; });


            
            

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .direction('e')
                .html(function (d) {
                    return "<ul class='list-unstyled mb-1'>" +
                        "<li>" + "<div class='fs-base my-1'>" + d.data.icon + d.data.status + "</div>" + "</li>" +
                        "<li>" + "Total: &nbsp;" + "<span class='fw-semibold float-end'>" + d.value + "</span>" + "</li>" +
                        "<li>" + "Share: &nbsp;" + "<span class='fw-semibold float-end'>" + (100 / (sum / d.value)).toFixed(2) + "%" + "</span>" + "</li>" +
                    "</ul>";
                });


            
            

            
            var container = d3Container.append("svg").call(tip);
            
            
            var svg = container
                .attr("width", size)
                .attr("height", size)
                .append("g")
                    .attr("transform", "translate(" + (size / 2) + "," + (size / 2) + ")");  


            
            

            
            var pie = d3.layout.pie()
                .sort(null)
                .startAngle(Math.PI)
                .endAngle(3 * Math.PI)
                .value(function (d) { 
                    return d.value;
                }); 

            
            var arc = d3.svg.arc()
                .outerRadius(radius);


            
            
            

            
            var arcGroup = svg.selectAll(".d3-arc")
                .data(pie(data))
                .enter()
                .append("g") 
                    .attr("class", "d3-arc d3-slice-border");
            
            
            var arcPath = arcGroup
                .append("path")
                .style("fill", function (d) {
                    return d.data.color;
                });

            
            arcPath
                .on('mouseover', function (d, i) {

                    
                    d3.select(this)
                    .transition()
                        .duration(500)
                        .ease('elastic')
                        .attr('transform', function (d) {
                            d.midAngle = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
                            var x = Math.sin(d.midAngle) * distance;
                            var y = -Math.cos(d.midAngle) * distance;
                            return 'translate(' + x + ',' + y + ')';
                        });
                })
                .on("mousemove", function (d) {
                    
                    
                    tip.show(d)
                        .style("top", (d3.event.pageY - 40) + "px")
                        .style("left", (d3.event.pageX + 30) + "px");
                })
                .on('mouseout', function (d, i) {

                    
                    d3.select(this)
                    .transition()
                        .duration(500)
                        .ease('bounce')
                        .attr('transform', 'translate(0,0)');

                    
                    tip.hide(d);
                });

            
            arcPath
                .transition()
                    .delay(function(d, i) { return i * 500; })
                    .duration(500)
                    .attrTween("d", function(d) {
                        var interpolate = d3.interpolate(d.startAngle,d.endAngle);
                        return function(t) {
                            d.endAngle = interpolate(t);
                            return arc(d);  
                        }; 
                    });


            
            
            

            
            d3Container
                .append('h4')
                .attr('class', 'pt-1 mt-2 mb-0');

            
            d3Container.select('h4')
                .transition()
                .duration(1500)
                .tween("text", function(d) {
                    var i = d3.interpolate(this.textContent, sum);

                    return function(t) {
                        this.textContent = d3.format(",d")(Math.round(i(t)));
                    };
                });
        }
    };

    
    var _animatedPieWithLegend = function(element, size) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {

            
            var data = [
                {
                    "status": "New",
                    "value": 578,
                    "color": "#29B6F6"
                }, {
                    "status": "Pending",
                    "value": 983,
                    "color": "#66BB6A"
                }, {
                    "status": "Shipped",
                    "value": 459,
                    "color": "#EF5350"
                }
            ];

            
            var d3Container = d3.select(element),
                distance = 2, 
                radius = (size/2) - distance,
                sum = d3.sum(data, function(d) { return d.value; });


            
            

            
            var container = d3Container.append("svg");
            
            
            var svg = container
                .attr("width", size)
                .attr("height", size)
                .append("g")
                    .attr("transform", "translate(" + (size / 2) + "," + (size / 2) + ")");  


            
            

            
            var pie = d3.layout.pie()
                .sort(null)
                .startAngle(Math.PI)
                .endAngle(3 * Math.PI)
                .value(function (d) { 
                    return d.value;
                }); 

            
            var arc = d3.svg.arc()
                .outerRadius(radius);


            
            
            

            
            var arcGroup = svg.selectAll(".d3-arc")
                .data(pie(data))
                .enter()
                .append("g") 
                    .attr("class", "d3-arc d3-slice-border");
            
            
            var arcPath = arcGroup
                .append("path")
                .style("fill", function (d) {
                    return d.data.color;
                });


            
            arcPath
                .on('mouseover', function (d, i) {

                    
                    d3.select(this)
                    .transition()
                        .duration(500)
                        .ease('elastic')
                        .attr('transform', function (d) {
                            d.midAngle = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
                            var x = Math.sin(d.midAngle) * distance;
                            var y = -Math.cos(d.midAngle) * distance;
                            return 'translate(' + x + ',' + y + ')';
                        });
                })
                .on('mouseout', function (d, i) {

                    
                    d3.select(this)
                    .transition()
                        .duration(500)
                        .ease('bounce')
                        .attr('transform', 'translate(0,0)');
                });

            
            arcPath
                .transition()
                    .delay(function(d, i) { return i * 500; })
                    .duration(500)
                    .attrTween("d", function(d) {
                        var interpolate = d3.interpolate(d.startAngle,d.endAngle);
                        return function(t) {
                            d.endAngle = interpolate(t);
                            return arc(d);  
                        }; 
                    });


            
            
            

            
            d3Container
                .append('h4')
                .attr('class', 'pt-1 mt-2 mb-0');

            
            d3Container.select('h4')
                .transition()
                .duration(1500)
                .tween("text", function(d) {
                    var i = d3.interpolate(this.textContent, sum);

                    return function(t) {
                        this.textContent = d3.format(",d")(Math.round(i(t)));
                    };
                });


            
            
            

            
            var legend = d3.select(element)
                .append('ul')
                .attr('class', 'chart-widget-legend')
                .selectAll('li').data(pie(data))
                .enter().append('li')
                .attr('data-slice', function(d, i) {
                    return i;
                })
                .attr('style', function(d, i) {
                    return 'border-bottom: 2px solid ' + d.data.color;
                })
                .text(function(d, i) {
                    return d.data.status + ': ';
                });

            
            legend.append('span')
                .text(function(d, i) {
                    return d.data.value;
                });
        }
    };

    
    var _pieArcWithLegend = function(element, size) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var data = [
                {
                    "status": "Pending",
                    "icon": "<i class='ph-clock-counter-clockwise text-primary me-2'></i>",
                    "value": 720,
                    "color": "#29B6F6"
                }, {
                    "status": "Resolved",
                    "icon": "<i class='ph-check text-success me-2'></i>",
                    "value": 990,
                    "color": "#66BB6A"
                }, {
                    "status": "Closed",
                    "icon": "<i class='ph-x text-danger me-2'></i>",
                    "value": 720,
                    "color": "#EF5350"
                }
            ];

            
            var d3Container = d3.select(element),
                distance = 2, 
                radius = (size/2) - (distance * 2),
                sum = d3.sum(data, function(d) { return d.value; });



            
            

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .direction('e')
                .html(function (d) {
                    return "<ul class='list-unstyled mb-1'>" +
                        "<li>" + "<div class='fs-base my-1'>" + d.data.icon + d.data.status + "</div>" + "</li>" +
                        "<li>" + "Total: &nbsp;" + "<span class='fw-semibold float-end'>" + d.value + "</span>" + "</li>" +
                        "<li>" + "Share: &nbsp;" + "<span class='fw-semibold float-end'>" + (100 / (sum / d.value)).toFixed(2) + "%" + "</span>" + "</li>" +
                    "</ul>";
                });



            
            

            
            var container = d3Container.append("svg").call(tip);
            
            
            var svg = container
                .attr("width", size)
                .attr("height", size / 2)
                .append("g")
                    .attr("transform", "translate(" + (size / 2) + "," + (size / 2) + ")");  



            
            

            
            var pie = d3.layout.pie()
                .sort(null)
                .startAngle(-Math.PI / 2)
                .endAngle(Math.PI / 2)
                .value(function (d) { 
                    return d.value;
                }); 

            
            var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(radius / 1.3);



            
            
            

            
            var arcGroup = svg.selectAll(".d3-arc")
                .data(pie(data))
                .enter()
                .append("g") 
                    .attr("class", "d3-arc d3-slice-border");

            
            var arcPath = arcGroup
                .append("path")
                .style("fill", function (d) {
                    return d.data.color;
                });


            
            
            

            
            arcPath
                .on('mouseover', function(d, i) {

                    
                    d3.select(this)
                    .transition()
                        .duration(500)
                        .ease('elastic')
                        .attr('transform', function (d) {
                            d.midAngle = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
                            var x = Math.sin(d.midAngle) * distance;
                            var y = -Math.cos(d.midAngle) * distance;
                            return 'translate(' + x + ',' + y + ')';
                        });
                })
                .on('mouseout', function(d, i) {

                    
                    d3.select(this)
                    .transition()
                        .duration(500)
                        .ease('bounce')
                        .attr('transform', 'translate(0,0)');
                });

            
            arcPath
                .transition()
                    .delay(function(d, i) {
                        return i * 500;
                    })
                    .duration(500)
                    .attrTween("d", function(d) {
                        var interpolate = d3.interpolate(d.startAngle,d.endAngle);
                        return function(t) {
                            d.endAngle = interpolate(t);
                            return arc(d);  
                        }; 
                    });


            
            
            

            svg.append('text')
                
                .attr({
                    'class': 'half-donut-total d3-text opacity-50',
                    'text-anchor': 'middle',
                    'dy': -33
                })
                .text('Total');


            
            
            

            
            svg
                .append('text')
                .attr('class', 'half-conut-count d3-text')
                .attr('text-anchor', 'middle')
                .attr('dy', -5)
                .style({
                    'font-size': '20px',
                    'font-weight': 500
                });

            
            svg.select('.half-conut-count')
                .transition()
                .duration(1500)
                .ease('linear')
                .tween("text", function(d) {
                    var i = d3.interpolate(this.textContent, sum);

                    return function(t) {
                        this.textContent = d3.format(",d")(Math.round(i(t)));
                    };
                });


            
            
            

            
            var legend = d3.select(element)
                .append('ul')
                .attr('class', 'chart-widget-legend')
                .selectAll('li')
                .data(pie(data))
                .enter()
                .append('li')
                .attr('data-slice', function(d, i) {
                    return i;
                })
                .attr('style', function(d, i) {
                    return 'border-bottom: solid 2px ' + d.data.color;
                })
                .text(function(d, i) {
                    return d.data.status + ': ';
                });

            
            legend.append('span')
                .text(function(d, i) {
                    return d.data.value;
                });
        }
    };

    
    var _animatedDonut = function(element, size) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {

            
            var data = [
                {
                    "status": "Pending tickets",
                    "icon": "<i class='ph-clock-counter-clockwise text-primary me-2'></i>",
                    "value": 567,
                    "color": "#29B6F6"
                }, {
                    "status": "Resolved tickets",
                    "icon": "<i class='ph-check text-success me-2'></i>",
                    "value": 234,
                    "color": "#66BB6A"
                }, {
                    "status": "Closed tickets",
                    "icon": "<i class='ph-x text-danger me-2'></i>",
                    "value": 642,
                    "color": "#EF5350"
                }
            ];

            
            var d3Container = d3.select(element),
                distance = 2, 
                radius = (size/2) - distance,
                sum = d3.sum(data, function(d) { return d.value; });


            
            

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .direction('e')
                .html(function (d) {
                    return "<ul class='list-unstyled mb-1'>" +
                        "<li>" + "<div class='fs-base my-1'>" + d.data.icon + d.data.status + "</div>" + "</li>" +
                        "<li>" + "Total: &nbsp;" + "<span class='fw-semibold float-end'>" + d.value + "</span>" + "</li>" +
                        "<li>" + "Share: &nbsp;" + "<span class='fw-semibold float-end'>" + (100 / (sum / d.value)).toFixed(2) + "%" + "</span>" + "</li>" +
                    "</ul>";
                });


            
            

            
            var container = d3Container.append("svg").call(tip);
            
            
            var svg = container
                .attr("width", size)
                .attr("height", size)
                .append("g")
                    .attr("transform", "translate(" + (size / 2) + "," + (size / 2) + ")");  


            
            

            
            var pie = d3.layout.pie()
                .sort(null)
                .startAngle(Math.PI)
                .endAngle(3 * Math.PI)
                .value(function (d) { 
                    return d.value;
                }); 

            
            var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(radius / 1.5);


            
            
            

            
            var arcGroup = svg.selectAll(".d3-arc")
                .data(pie(data))
                .enter()
                .append("g") 
                    .attr("class", "d3-arc d3-slice-border")
                    .style({
                        'cursor': 'pointer'
                    });
            
            
            var arcPath = arcGroup
                .append("path")
                .style("fill", function (d) {
                    return d.data.color;
                });

            
            arcPath
                .on('mouseover', function (d, i) {

                    
                    d3.select(this)
                    .transition()
                        .duration(500)
                        .ease('elastic')
                        .attr('transform', function (d) {
                            d.midAngle = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
                            var x = Math.sin(d.midAngle) * distance;
                            var y = -Math.cos(d.midAngle) * distance;
                            return 'translate(' + x + ',' + y + ')';
                        });
                })
                .on("mousemove", function (d) {
                    
                    
                    tip.show(d)
                        .style("top", (d3.event.pageY - 40) + "px")
                        .style("left", (d3.event.pageX + 30) + "px");
                })
                .on('mouseout', function (d, i) {

                    
                    d3.select(this)
                    .transition()
                        .duration(500)
                        .ease('bounce')
                        .attr('transform', 'translate(0,0)');

                    
                    tip.hide(d);
                });

            
            arcPath
                .transition()
                    .delay(function(d, i) { return i * 500; })
                    .duration(500)
                    .attrTween("d", function(d) {
                        var interpolate = d3.interpolate(d.startAngle,d.endAngle);
                        return function(t) {
                            d.endAngle = interpolate(t);
                            return arc(d);  
                        }; 
                    });


            
            
            

            
            svg
                .append('text')
                .attr('class', 'd3-text')
                .attr('text-anchor', 'middle')
                .attr('dy', 6)
                .style({
                    'font-size': '16px',
                    'font-weight': 500
                });

            
            svg.select('text')
                .transition()
                .duration(1500)
                .tween("text", function(d) {
                    var i = d3.interpolate(this.textContent, sum);
                    return function(t) {
                        this.textContent = d3.format(",d")(Math.round(i(t)));
                    };
                });
        }
    };

    
    var _animatedDonutWithLegend = function(element, size) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {

            
            var data = [
                {
                    "status": "New",
                    "value": 790,
                    "color": "#29B6F6"
                }, {
                    "status": "Pending",
                    "value": 850,
                    "color": "#66BB6A"
                }, {
                    "status": "Shipped",
                    "value": 760,
                    "color": "#EF5350"
                }
            ];

            
            var d3Container = d3.select(element),
                distance = 2, 
                radius = (size/2) - distance,
                sum = d3.sum(data, function(d) { return d.value; });


            
            

            
            var container = d3Container.append("svg");
            
            
            var svg = container
                .attr("width", size)
                .attr("height", size)
                .append("g")
                    .attr("transform", "translate(" + (size / 2) + "," + (size / 2) + ")");  


            
            

            
            var pie = d3.layout.pie()
                .sort(null)
                .startAngle(Math.PI)
                .endAngle(3 * Math.PI)
                .value(function (d) { 
                    return d.value;
                }); 

            
            var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(radius / 1.5);


            
            
            

            
            var arcGroup = svg.selectAll(".d3-arc")
                .data(pie(data))
                .enter()
                .append("g") 
                    .attr("class", "d3-arc d3-slice-border")
                    .style({
                        'cursor': 'pointer'
                    });
            
            
            var arcPath = arcGroup
                .append("path")
                .style("fill", function (d) {
                    return d.data.color;
                });


            
            arcPath
                .on('mouseover', function (d, i) {

                    
                    d3.select(this)
                    .transition()
                        .duration(500)
                        .ease('elastic')
                        .attr('transform', function (d) {
                            d.midAngle = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
                            var x = Math.sin(d.midAngle) * distance;
                            var y = -Math.cos(d.midAngle) * distance;
                            return 'translate(' + x + ',' + y + ')';
                        });
                })
                .on('mouseout', function (d, i) {

                    
                    d3.select(this)
                    .transition()
                        .duration(500)
                        .ease('bounce')
                        .attr('transform', 'translate(0,0)');
                });

            
            arcPath
                .transition()
                    .delay(function(d, i) {
                        return i * 500;
                    })
                    .duration(500)
                    .attrTween("d", function(d) {
                        var interpolate = d3.interpolate(d.startAngle,d.endAngle);
                        return function(t) {
                            d.endAngle = interpolate(t);
                            return arc(d);  
                        }; 
                    });


            
            
            

            
            svg
                .append('text')
                .attr('class', 'd3-text')
                .attr('text-anchor', 'middle')
                .attr('dy', 6)
                .style({
                    'font-size': '17px',
                    'font-weight': 500
                });

            
            svg.select('text')
                .transition()
                .duration(1500)
                .tween("text", function(d) {
                    var i = d3.interpolate(this.textContent, sum);
                    return function(t) {
                        this.textContent = d3.format(",d")(Math.round(i(t)));
                    };
                });


            
            
            

            
            var legend = d3.select(element)
                .append('ul')
                .attr('class', 'chart-widget-legend')
                .selectAll('li').data(pie(data))
                .enter().append('li')
                .attr('data-slice', function(d, i) {
                    return i;
                })
                .attr('style', function(d, i) {
                    return 'border-bottom: 2px solid ' + d.data.color;
                })
                .text(function(d, i) {
                    return d.data.status + ': ';
                });

            
            legend.append('span')
                .text(function(d, i) {
                    return d.data.value;
                });
        }
    };

    
    var _donutWithDetails = function(element, size) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var data = [
                {
                    "status": "Pending",
                    "icon": "<i class='bg-primary bg-opacity-75 rounded-pill p-1 me-2'></i>",
                    "value": 720,
                    "color": "#29B6F6"
                }, {
                    "status": "Resolved",
                    "icon": "<i class='bg-success bg-opacity-75 rounded-pill p-1 me-2'></i>",
                    "value": 990,
                    "color": "#66BB6A"
                }, {
                    "status": "Closed",
                    "icon": "<i class='bg-danger bg-opacity-75 rounded-pill p-1 me-2'></i>",
                    "value": 720,
                    "color": "#EF5350"
                }
            ];

            
            var d3Container = d3.select(element),
                distance = 2, 
                radius = (size/2) - distance,
                sum = d3.sum(data, function(d) { return d.value; });


            
            

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .direction('e')
                .html(function (d) {
                    return "<ul class='list-unstyled mb-1'>" +
                        "<li>" + "<div class='fs-base my-1'>" + d.data.icon + d.data.status + "</div>" + "</li>" +
                        "<li>" + "Total: &nbsp;" + "<span class='fw-semibold float-end'>" + d.value + "</span>" + "</li>" +
                        "<li>" + "Share: &nbsp;" + "<span class='fw-semibold float-end'>" + (100 / (sum / d.value)).toFixed(2) + "%" + "</span>" + "</li>" +
                    "</ul>";
                });


            
            

            
            var container = d3Container.append("svg").call(tip);
            
            
            var svg = container
                .attr("width", size)
                .attr("height", size)
                .append("g")
                    .attr("transform", "translate(" + (size / 2) + "," + (size / 2) + ")");  


            
            

            
            var pie = d3.layout.pie()
                .sort(null)
                .startAngle(Math.PI)
                .endAngle(3 * Math.PI)
                .value(function (d) { 
                    return d.value;
                }); 

            
            var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(radius / 1.35);


            
            
            

            
            var arcGroup = svg.selectAll(".d3-arc")
                .data(pie(data))
                .enter()
                .append("g") 
                    .attr("class", "d3-arc d3-slice-border")
                    .style({
                        'cursor': 'pointer'
                    });
            
            
            var arcPath = arcGroup
                .append("path")
                .style("fill", function (d) {
                    return d.data.color;
                });


            
            
            

            
            arcPath
                .on('mouseover', function(d, i) {

                    
                    d3.select(this)
                    .transition()
                        .duration(500)
                        .ease('elastic')
                        .attr('transform', function (d) {
                            d.midAngle = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
                            var x = Math.sin(d.midAngle) * distance;
                            var y = -Math.cos(d.midAngle) * distance;
                            return 'translate(' + x + ',' + y + ')';
                        });
                })
                .on('mouseout', function(d, i) {

                    
                    d3.select(this)
                    .transition()
                        .duration(500)
                        .ease('bounce')
                        .attr('transform', 'translate(0,0)');
                });

            
            arcPath
                .transition()
                .delay(function(d, i) {
                    return i * 500;
                })
                .duration(500)
                .attrTween("d", function(d) {
                    var interpolate = d3.interpolate(d.startAngle,d.endAngle);
                    return function(t) {
                        d.endAngle = interpolate(t);
                        return arc(d);  
                    }; 
                });


            
            
            

            
            svg.append('text')
                .attr({
                    'class': 'half-donut-total d3-text opacity-50',
                    'text-anchor': 'middle',
                    'dy': -13
                })
                .text('Total');

            
            svg
                .append('text')
                .attr('class', 'half-donut-count d3-text')
                .attr('text-anchor', 'middle')
                .attr('dy', 14)
                .style({
                    'font-size': '21px',
                    'font-weight': 500
                });

            
            svg.select('.half-donut-count')
                .transition()
                .duration(1500)
                .ease('linear')
                .tween("text", function(d) {
                    var i = d3.interpolate(this.textContent, sum);

                    return function(t) {
                        this.textContent = d3.format(",d")(Math.round(i(t)));
                    };
                });


            
            
            

            
            var legend = d3.select(element)
                .append('ul')
                .attr('class', 'chart-widget-legend')
                .selectAll('li')
                .data(pie(data))
                .enter()
                .append('li')
                .attr('data-slice', function(d, i) {
                    return i;
                })
                .attr('style', function(d, i) {
                    return 'border-bottom: solid 2px ' + d.data.color;
                })
                .text(function(d, i) {
                    return d.data.status + ': ';
                });

            
            legend.append('span')
                .text(function(d, i) {
                    return d.data.value;
                });
        }
    };

    
    var _progressArcSingle = function(element, size) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {

            
            var d3Container = d3.select(element),
                radius = size,
                thickness = 20,
                color = '#29B6F6';


            
            

            
            var container = d3Container.append("svg");
            
            
            var svg = container
                .attr('width', radius * 2)
                .attr('height', radius + 20)
                .attr('class', 'gauge');


            
            

            
            var arc = d3.svg.arc()
                .innerRadius(radius - thickness)
                .outerRadius(radius)
                .startAngle(-Math.PI / 2);


            
            

            
            
            

            
            var chart = svg.append('g')
                .attr('transform', 'translate(' + radius + ',' + radius + ')');

            
            var background = chart.append('path')
                .datum({
                    endAngle: Math.PI / 2
                })
                .attr({
                    'd': arc,
                    'class': 'd3-state-empty'
                });

            
            var foreground = chart.append('path')
                .datum({
                    endAngle: -Math.PI / 2
                })
                .style('fill', color)
                .attr('d', arc);

            
            var value = svg.append('g')
                .attr('transform', 'translate(' + radius + ',' + (radius * 0.9) + ')')
                .append('text')
                .text(0 + '%')
                .attr({
                    'class': 'd3-text',
                    'text-anchor': 'middle'
                })
                .style({
                    'font-size': 18,
                    'font-weight': 400
                });


            
            
            

            
            var scale = svg.append('g')
                .attr('transform', 'translate(' + radius + ',' + (radius + 15) + ')')
                .attr('class', 'd3-text opacity-75')
                .style({
                    'font-size': 12
                });

            
            scale.append('text')
                .text(100)
                .attr({
                    'text-anchor': 'middle',
                    'x': (radius - thickness / 2)
                });

            
            scale.append('text')
                .text(0)
                .attr({
                    'text-anchor': 'middle',
                    'x': -(radius - thickness / 2)
                });


            
            
            

            
            setInterval(function() {
                update(Math.random() * 100);
            }, 1500);

            
            function update(v) {
                v = d3.format('.0f')(v);
                foreground.transition()
                    .duration(750)
                    .call(arcTween, v);

                value.transition()
                    .duration(750)
                    .call(textTween, v);
            }

            
            function arcTween(transition, v) {
                var newAngle = v / 100 * Math.PI - Math.PI / 2;
                transition.attrTween('d', function(d) {
                    var interpolate = d3.interpolate(d.endAngle, newAngle);
                    return function(t) {
                        d.endAngle = interpolate(t);
                        return arc(d);
                    };
                });
            }

            
            function textTween(transition, v) {
                transition.tween('text', function() {
                    var interpolate = d3.interpolate(this.innerHTML, v),
                        split = (v + '').split('.'),
                        round = (split.length > 1) ? Math.pow(10, split[1].length) : 1;
                    return function(t) {
                        this.innerHTML = d3.format('.0f')(Math.round(interpolate(t) * round) / round) + '<tspan>%</tspan>';
                    };
                });
            }
        }
    };

    
    var _progressArcMulti = function(element, size, goal) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {

            
            var d3Container = d3.select(element),
                radius = size,
                thickness = 20,
                startColor = '#66BB6A',
                midColor = '#FFA726',
                endColor = '#EF5350';

            
            var color = d3.scale.linear()
                .domain([0, 70, 100])
                .range([startColor, midColor, endColor]);


            
            

            
            var container = d3Container.append("svg");
            
            
            var svg = container
                .attr('width', radius * 2)
                .attr('height', radius + 20);


            
            

            
            var arc = d3.svg.arc()
                .innerRadius(radius - thickness)
                .outerRadius(radius)
                .startAngle(-Math.PI / 2);


            
            

            
            
            

            
            var chart = svg.append('g')
                .attr('transform', 'translate(' + radius + ',' + radius + ')');

            
            var background = chart.append('path')
                .datum({
                    endAngle: Math.PI / 2
                })
                .attr({
                    'd': arc,
                    'class': 'd3-state-empty'
                });

            
            var foreground = chart.append('path')
                .datum({
                    endAngle: -Math.PI / 2
                })
                .style('fill', startColor)
                .attr('d', arc);

            
            var value = svg.append('g')
                .attr('transform', 'translate(' + radius + ',' + (radius * 0.9) + ')')
                .append('text')
                .text(0 + '%')
                .attr({
                    'class': 'd3-text',
                    'text-anchor': 'middle'
                })
                .style({
                    'font-size': 18,
                    'font-weight': 400
                });


            
            
            

            
            var scale = svg.append('g')
                .attr('transform', 'translate(' + radius + ',' + (radius + 15) + ')')
                .attr('class', 'd3-text opacity-75')
                .style({
                    'font-size': 12
                });

            
            scale.append('text')
                .text(100)
                .attr({
                    'text-anchor': 'middle',
                    'x': (radius - thickness / 2)
                });

            
            scale.append('text')
                .text(0)
                .attr({
                    'text-anchor': 'middle',
                    'x': -(radius - thickness / 2)
                });


            
            
            

            
            setInterval(function() {
                update(Math.random() * 100);
            }, 1500);

            
            function update(v) {
                v = d3.format('.0f')(v);
                foreground.transition()
                    .duration(750)
                    .style('fill', function() {
                        return color(v);
                    })
                    .call(arcTween, v);

                value.transition()
                    .duration(750)
                    .call(textTween, v);
            }

            
            function arcTween(transition, v) {
                var newAngle = v / 100 * Math.PI - Math.PI / 2;
                transition.attrTween('d', function(d) {
                    var interpolate = d3.interpolate(d.endAngle, newAngle);
                    return function(t) {
                        d.endAngle = interpolate(t);
                        return arc(d);
                    };
                });
            }

            
            function textTween(transition, v) {
                transition.tween('text', function() {
                    var interpolate = d3.interpolate(this.innerHTML, v),
                        split = (v + '').split('.'),
                        round = (split.length > 1) ? Math.pow(10, split[1].length) : 1;
                    return function(t) {
                        this.innerHTML = d3.format('.0f')(Math.round(interpolate(t) * round) / round) + '<tspan>%</tspan>';
                    };
                });
            }
        }
    };

    
    var _roundedProgressSingle = function(element, size, goal, color) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {

            
            var dataset = function () {
                return [
                    {percentage: Math.random() * 100}
                ];
            };

            
            var d3Container = d3.select(element),
                padding = 2,
                strokeWidth = 16,
                width = size,
                height = size,
                τ = 2 * Math.PI;


            
            

            
            var container = d3Container.append("svg");
            
            
            var svg = container
                .attr("width", width)
                .attr("height", height)
                .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


            
            

            
            var arc = d3.svg.arc()
                .startAngle(0)
                .endAngle(function (d) {
                    return d.percentage / 100 * τ;
                })
                .innerRadius((size / 2) - strokeWidth)
                .outerRadius((size / 2) - padding)
                .cornerRadius(20);

            
            var background = d3.svg.arc()
                .startAngle(0)
                .endAngle(τ)
                .innerRadius((size / 2) - strokeWidth)
                .outerRadius((size / 2) - padding);


            
            

            
            
            

            
            var field = svg.selectAll("g")
                .data(dataset)
                .enter().append("g");

            
            field
                .append("path")
                .attr("class", "arc-foreground")
                .attr('fill', color);

            
            field
                .append("path")
                .attr("d", background)
                .style({
                    "fill": color,
                    "opacity": 0.2
                });


            
            
            

            
            field
                .append("text")
                .text("Out of " + goal)
                .attr({
                    'class': 'd3-text opacity-50',
                    'transform': 'translate(0,20)'
                })
                .style({
                    'font-size': 11,
                    'font-weight': 500,
                    'text-transform': 'uppercase',
                    'text-anchor': 'middle'
                });

            
            field
                .append("text")
                .attr('class', 'arc-goal-completed d3-text')
                .attr("transform", "translate(0,0)")
                .style({
                    'font-size': 23,
                    'font-weight': 500,
                    'text-anchor': 'middle'
                });


            
            
            

            
            d3.transition().duration(2500).each(update);


            
            function update() {
                field = field
                    .each(function (d) {
                        this._value = d.percentage;
                    })
                    .data(dataset)
                    .each(function (d) {
                        d.previousValue = this._value;
                    });

                
                field
                    .select(".arc-foreground")
                    .transition()
                    .duration(600)
                    .ease("easeInOut")
                    .attrTween("d", arcTween);
                    
                
                field
                    .select(".arc-goal-completed")
                    .text(function (d) {
                        return Math.round(d.percentage /100 * goal);
                    });

                
                svg.select('.arc-goal-completed')
                    .transition()
                    .duration(600)
                    .tween("text", function(d) {
                        var i = d3.interpolate(this.textContent, d.percentage);
                        return function(t) {
                            this.textContent = Math.floor(d.percentage/100 * goal);
                        };
                    });

                
                setTimeout(update, 4000);
            }

            
            function arcTween(d) {
                var i = d3.interpolateNumber(d.previousValue, d.percentage);
                return function (t) {
                    d.percentage = i(t);
                    return arc(d);
                };
            }
        }
    };

    
    var _roundedProgressMultiple = function(element, size) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {

            
            var data = [
                    {index: 0, name: 'Memory', percentage: 0},
                    {index: 1, name: 'CPU', percentage: 0},
                    {index: 2, name: 'Sessions', percentage: 0}
                ];

            
            var d3Container = d3.select(element),
                padding = 2,
                strokeWidth = 8,
                width = size,
                height = size,
                τ = 2 * Math.PI;

            
            var colors = ['#78909C', '#F06292', '#4DB6AC'];


            
            

            
            var container = d3Container.append("svg");
            
            
            var svg = container
                .attr("width", width)
                .attr("height", height)
                .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


            
            

            
            var arc = d3.svg.arc()
                .startAngle(0)
                .endAngle(function (d) {
                    return d.percentage / 100 * τ;
                })
                .innerRadius(function (d) {
                    return (size / 2) - d.index * (strokeWidth + padding);
                })
                .outerRadius(function (d) {
                    return ((size / 2) - d.index * (strokeWidth + padding)) - strokeWidth;
                })
                .cornerRadius(20);

            
            var background = d3.svg.arc()
                .startAngle(0)
                .endAngle(τ)
                .innerRadius(function (d) {
                    return (size / 2) - d.index * (strokeWidth + padding);
                })
                .outerRadius(function (d) {
                    return ((size / 2) - d.index * (strokeWidth + padding)) - strokeWidth;
                });


            
            

            
            
            

            
            var field = svg.selectAll("g")
                .data(data)
                .enter().append("g");

            
            field
                .append("path")
                .attr("class", "arc-foreground")
                .style("fill", function (d, i) {
                    return colors[i];
                });

            
            field
                .append("path")
                .style("fill", function (d, i) {
                    return colors[i];
                })
                .style("opacity", 0.1)
                .attr("d", background);


            
            
            

            
            var legend = d3.select(element)
                .append('ul')
                .attr('class', 'chart-widget-legend d3-text')
                .selectAll('li')
                .data(data)
                .enter()
                .append('li')
                .attr('data-slice', function(d, i) {
                    return i;
                })
                .attr('style', function(d, i) {
                    return 'border-bottom: solid 2px ' + colors[i];
                })
                .text(function(d, i) {
                    return d.name;
                });


            
            
            

            
            d3.transition().each(update);

            
            function update() {
                field = field
                    .each(function (d) {
                        this._value = d.percentage;
                    })
                    .data(data)
                    .each(function (d) {
                        d.previousValue = this._value;
                        d.percentage = Math.round(Math.random() * 100) + 1;
                    });

                
                field
                    .select("path.arc-foreground")
                    .transition()
                    .duration(750)
                    .ease("easeInOut")
                    .attrTween("d", arcTween);
                    
                
                setTimeout(update, 4000);
            }

            
            function arcTween(d) {
                var i = d3.interpolateNumber(d.previousValue, d.percentage);
                return function (t) {
                    d.percentage = i(t);
                    return arc(d);
                };
            }
        }
    };

    
    var _pieWithProgress = function(element, size) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {

            
            var dataset = [
                    { name: 'New', count: 639 },
                    { name: 'Pending', count: 255 },
                    { name: 'Shipped', count: 215 }
                ];

            
            var d3Container = d3.select(element),
                total = 0,
                width = size,
                height = size,
                distance = 2, 
                progressSpacing = 6,
                progressSize = (progressSpacing + 2),
                arcSize = 20,
                outerRadius = (width / 2) - distance,
                innerRadius = (outerRadius - arcSize);

            
            var color = d3.scale.ordinal()
                .range(['#EF5350', '#29b6f6', '#66BB6A']);


            
            

            
            var container = d3Container.append("svg");
            
            
            var svg = container
                .attr("width", width)
                .attr("height", height)
                .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


            
            

            
            dataset.forEach(function(d){
                total+= d.count;
            });

            
            var pie = d3.layout.pie()
                .value(function(d){ return d.count; })
                .sort(null);

            
            var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

            
            var arcLine = d3.svg.arc()
                .innerRadius(innerRadius - progressSize)
                .outerRadius(innerRadius - progressSpacing)
                .startAngle(0);


            
            

            
            
            
            var arcTween = function(transition, newAngle) {
                transition.attrTween("d", function (d) {
                    var interpolate = d3.interpolate(d.endAngle, newAngle);
                    var interpolateCount = d3.interpolate(0, dataset[0].count);
                    return function (t) {
                        d.endAngle = interpolate(t);
                        middleCount.text(d3.format(",d")(Math.floor(interpolateCount(t))));
                        return arcLine(d);
                    };
                });
            };


            
            
            

            
            var path = svg.selectAll('path')
                .data(pie(dataset))
                .enter()
                .append('path')
                .attr('class', 'd3-slice-border')
                .attr('d', arc)
                .attr('fill', function(d, i) {
                    return color(d.data.name);
                });

            
            path
                .transition()
                .delay(function(d, i) { return i; })
                .duration(600)
                .attrTween("d", function(d) {
                    var interpolate = d3.interpolate(d.startAngle, d.endAngle);
                    return function(t) {
                        d.endAngle = interpolate(t);
                        return arc(d);  
                    }; 
                });


            
            
            

            
            var pathLine = svg.append('path')
                .datum({endAngle: 0})
                .attr('d', arcLine)
                .style({
                    fill: color('New')
                });

            
            pathLine.transition()
                .duration(600)
                .delay(300)
                .call(arcTween, (2 * Math.PI) * (dataset[0].count / total));


            
            
            

            var middleCount = svg.append('text')
                .datum(0)
                .attr({
                    'class': 'd3-text', 
                    'dy': 6
                })
                .style({
                    'font-size': '20px',
                    'font-weight': 500,
                    'text-anchor': 'middle'
                })
                .text(function(d){
                    return d;
                });            


            path
                .on('mouseover', function(d, i) {

                    
                    d3.select(this)
                    .transition()
                        .duration(500)
                        .ease('elastic')
                        .attr('transform', function (d) {
                            d.midAngle = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
                            var x = Math.sin(d.midAngle) * distance;
                            var y = -Math.cos(d.midAngle) * distance;
                            return 'translate(' + x + ',' + y + ')';
                        });
                })
                .on('mouseout', function(d, i) {

                    
                    d3.select(this)
                    .transition()
                        .duration(500)
                        .ease('bounce')
                        .attr('transform', 'translate(0,0)');
                });

            
            
            

            
            var legend = d3.select(element)
                .append('ul')
                .attr('class', 'chart-widget-legend')
                .selectAll('li')
                .data(pie(dataset))
                .enter()
                .append('li')
                .attr('data-slice', function(d, i) {
                    return i;
                })
                .attr('style', function(d, i) {
                    return 'border-bottom: solid 2px ' + color(d.data.name);
                })
                .text(function(d, i) {
                    return d.data.name + ': ';
                });

            
            legend.append('span')
                .text(function(d, i) {
                    return d.data.count;
                });
        }
    };

    
    var _segmentedGauge = function(element, size, min, max, sliceQty) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {

            
            var d3Container = d3.select(element),
                width = size,
                height = (size / 2) + 20,
                radius = (size / 2),
                ringInset = 15,
                ringWidth = 20,

                pointerWidth = 10,
                pointerTailLength = 5,
                pointerHeadLengthPercent = 0.75,
                
                minValue = min,
                maxValue = max,
                
                minAngle = -90,
                maxAngle = 90,
                
                slices = sliceQty,
                range = maxAngle - minAngle,
                pointerHeadLength = Math.round(radius * pointerHeadLengthPercent);

            
            var colors = d3.scale.linear()
                .domain([0, slices - 1])
                .interpolate(d3.interpolateHsl)
                .range(['#66BB6A', '#EF5350']);


            
            

            
            var container = d3Container.append('svg');

            
            var svg = container
                .attr('width', width)
                .attr('height', height);


            
            
            
            
            var arc = d3.svg.arc()
                .innerRadius(radius - ringWidth - ringInset)
                .outerRadius(radius - ringInset)
                .startAngle(function(d, i) {
                    var ratio = d * i;
                    return deg2rad(minAngle + (ratio * range));
                })
                .endAngle(function(d, i) {
                    var ratio = d * (i + 1);
                    return deg2rad(minAngle + (ratio * range));
                });

            
            var scale = d3.scale.linear()
                .range([0, 1])
                .domain([minValue, maxValue]);
                
            
            var ticks = scale.ticks(slices);
            var tickData = d3.range(slices)
                .map(function() {
                    return 1 / slices;
                });

            
            function deg2rad(deg) {
                return deg * Math.PI / 180;
            }
                
            
            function newAngle(d) {
                var ratio = scale(d);
                var newAngle = minAngle + (ratio * range);
                return newAngle;
            }


            
            

            
            
            

            
            var arcs = svg.append('g')
                .attr('class', 'd3-slice-border')
                .attr('transform', "translate(" + radius + "," + radius + ")");

            
            arcs.selectAll('path')
                .data(tickData)
                .enter()
                .append('path')
                .attr('fill', function(d, i) {
                    return colors(i);
                })
                .attr('d', arc);


            
            
            

            
            var arcLabels = svg.append('g')
                .attr('transform', "translate(" + radius + "," + radius + ")");

            
            arcLabels.selectAll('text')
                .data(ticks)
                .enter()
                .append('text')
                .attr('class', 'd3-text opacity-50')
                .attr('transform', function(d) {
                    var ratio = scale(d);
                    var newAngle = minAngle + (ratio * range);
                    return 'rotate(' + newAngle + ') translate(0,' + (10 - radius) + ')';
                })
                .style({
                    'text-anchor': 'middle',
                    'font-size': 12
                })
                .text(function(d) { return d + "%"; });


            
            
            

            
            var lineData = [
                [pointerWidth / 2, 0], 
                [0, -pointerHeadLength],
                [-(pointerWidth / 2), 0],
                [0, pointerTailLength],
                [pointerWidth / 2, 0]
            ];

            
            var pointerLine = d3.svg.line()
                .interpolate('monotone');

            
            var pointerGroup = svg
                .append('g')
                .data([lineData])
                .attr('transform', "translate(" + radius + "," + radius + ")");

            
            pointer = pointerGroup
                .append('path')
                .attr('d', pointerLine)
                .attr('fill', 'var(--body-color)')
                .attr('transform', 'rotate(' + minAngle + ')');


            
            

            
            function update() {
                var ratio = scale(Math.random() * max);
                var newAngle = minAngle + (ratio * range);
                pointer.transition()
                    .duration(2500)
                    .ease('elastic')
                    .attr('transform', 'rotate(' + newAngle + ')');
            }
            update();

            
            setInterval(function() {
                update();
            }, 5000);
        }
    };


    
    
    

    return {
        init: function() {
            _areaChartWidget("#chart_area_basic", 50, '#5C6BC0');
            _areaChartWidget("#chart_area_color", 50, 'rgba(255,255,255,0.75)');

            _barChartWidget("#chart_bar_basic", 24, 50, true, "elastic", 1200, 50, "#EF5350", "members");
            _barChartWidget("#chart_bar_color", 24, 50, true, "elastic", 1200, 50, "rgba(255,255,255,0.75)", "members");

            _lineChartWidget('#line_chart_simple', 50, '#2196F3', 'rgba(33,150,243,0.5)', '#2196F3', '#2196F3');
            _lineChartWidget('#line_chart_color', 50, '#fff', 'rgba(255,255,255,0.5)', '#fff', '#29B6F6');

            _sparklinesWidget("#sparklines_basic", "area", 30, 50, "basis", 750, 2000, "#66BB6A");
            _sparklinesWidget("#sparklines_color", "area", 30, 50, "basis", 750, 2000, "rgba(255,255,255,0.75)");

            _progressIcon('#progress_icon_one', 42, 2.5, "#4cb6ac", 0.68, "ph-heart");
            _progressIcon('#progress_icon_two', 42, 2.5, "#28b6f6", 0.82, "ph-trophy");
            _progressIcon('#progress_icon_three', 42, 2.5, "#fff", 0.73, "ph-package");
            _progressIcon('#progress_icon_four', 42, 2.5, "#fff", 0.49, "ph-truck");

            _progressPercentage('#progress_percentage_one', 46, 3, "#ec3f7a", 0.79);
            _progressPercentage('#progress_percentage_two', 46, 3, "#66bb6a", 0.62);
            _progressPercentage('#progress_percentage_three', 46, 3, "#fff", 0.69);
            _progressPercentage('#progress_percentage_four', 46, 3, "#fff", 0.43);

            _animatedPie("#pie_basic", 120);
            _animatedPieWithLegend("#pie_basic_legend", 120);
            _pieArcWithLegend("#pie_arc_legend", 170);
            _animatedDonut("#donut_basic_stats", 120);
            _animatedDonutWithLegend("#donut_basic_legend", 120);
            _donutWithDetails("#donut_basic_details", 146);
            _progressArcSingle("#arc_single", 78);
            _progressArcMulti("#arc_multi", 78, 700);
            _roundedProgressSingle("#rounded_progress_single", 150, 700, '#EC407A');
            _roundedProgressMultiple("#rounded_progress_multiple", 140);
            _pieWithProgress("#pie_progress_bar", 146);
            _segmentedGauge("#segmented_gauge", 200, 0, 100, 5);
        }
    }
}();






document.addEventListener('DOMContentLoaded', function() {
    StatisticWidgets.init();
});
