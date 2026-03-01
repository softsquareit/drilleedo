





var DashboardAreas = function() {


    
    
    

    
    var _MonthlySalesAreaChart = function(element, height, color) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var d3Container = d3.select(element),
                margin = {top: 20, right: 35, bottom: 40, left: 35},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom;

            
            var parseDate = d3.time.format('%Y-%m-%d').parse,
                bisectDate = d3.bisector(function(d) { return d.date; }).left,
                formatDate = d3.time.format('%b %d');


            
            

            
            var container = d3Container.append('svg');

            
            var svg = container
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')



            
            

            
            var area = d3.svg.area()
                .x(function(d) { return x(d.date); })
                .y0(height)
                .y1(function(d) { return y(d.value); })
                .interpolate('monotone')


            
            

            
            var x = d3.time.scale().range([0, width ]);

            
            var y = d3.scale.linear().range([height, 0]);


            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom')
                .ticks(d3.time.days, 6)
                .innerTickSize(4)
                .tickPadding(8)
                .tickFormat(d3.time.format('%b %d'));


            
            

            d3.json('../../../assets/demo/data/dashboard/monthly_sales.json', function (error, data) {

                
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



                
                
                

                
                

                
                var horizontalAxis = svg.append('g')
                    .attr('class', 'd3-axis d3-axis-horizontal')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis);

                
                horizontalAxis.selectAll('.d3-axis-subticks')
                    .data(x.ticks(d3.time.days), function(d) { return d; })
                    .enter()
                        .append('line')
                        .attr('class', 'd3-axis-subticks')
                        .attr('y1', 0)
                        .attr('y2', 4)
                        .attr('x1', x)
                        .attr('x2', x);



                
                

                
                svg.append('path')
                    .datum(data)
                    .attr('class', 'd3-area')
                    .attr('d', area)
                    .style('fill', color)
                    .transition() 
                        .duration(1000)
                        .attrTween('d', function() {
                            var interpolator = d3.interpolateArray(startData, data);
                            return function (t) {
                                return area(interpolator (t));
                            }
                        });



                
                

                
                
                

                
                var focusLine = svg.append('g')
                    .style('display', 'none');

                
                focusLine.append('line')
                    .attr('class', 'vertical-crosshair d3-crosshair-line')
                    .attr('y1', 0)
                    .attr('y2', -maxY);


                
                
                

                
                var focusPointer = svg.append('g')
                    .attr('class', 'd3-crosshair-pointer')
                    .style('display', 'none');

                
                focusPointer.append('circle')
                    .attr('class', 'd3-line-circle')
                    .attr('r', 3)
                    .style('stroke', color)
                    .style('stroke-width', 1.5);


                
                
                

                
                var focusText = svg.append('g')
                    .attr('class', 'd3-crosshair-text')
                    .style('display', 'none');

                
                focusText.append('text')
                    .attr('class', 'd3-text')
                    .attr('dy', -10)
                    .style('font-size', 12);


                
                
                

                svg.append('rect')
                    .attr('class', 'd3-crosshair-overlay')
                    .style('fill', 'none')
                    .style('pointer-events', 'all')
                    .attr('width', width)
                    .attr('height', height)
                        .on('mouseover', function() {
                            focusPointer.style('display', null);        
                            focusLine.style('display', null)
                            focusText.style('display', null);
                        })
                        .on('mouseout', function() {
                            focusPointer.style('display', 'none'); 
                            focusLine.style('display', 'none');
                            focusText.style('display', 'none');
                        })
                        .on('mousemove', mousemove);


                
                function mousemove() {

                    
                    var mouse = d3.mouse(this),
                        mousex = mouse[0],
                        mousey = mouse[1],
                        x0 = x.invert(mousex),
                        i = bisectDate(data, x0),
                        d0 = data[i - 1],
                        d1 = data[i],
                        d = x0 - d0.date > d1.date - x0 ? d1 : d0;

                    
                    focusLine.attr('transform', 'translate(' + x(d.date) + ',' + height + ')');

                    
                    focusPointer.attr('transform', 'translate(' + x(d.date) + ',' + y(d.value) + ')');

                    
                    if(mousex >= (d3Container.node().getBoundingClientRect().width - focusText.select('text').node().getBoundingClientRect().width - margin.right - margin.left)) {
                        focusText.select('text').attr('text-anchor', 'end').attr('x', function () { return (x(d.date) - 15) + 'px' }).text(formatDate(d.date) + ' - ' + d.value + ' sales');
                    }
                    else {
                        focusText.select('text').attr('text-anchor', 'start').attr('x', function () { return (x(d.date) + 15) + 'px' }).text(formatDate(d.date) + ' - ' + d.value + ' sales');
                    }
                }



                
                

                
                var resizeSalesAreaTimer;
                window.addEventListener('resize', function() {
                    clearTimeout(resizeSalesAreaTimer);
                    resizeSalesAreaTimer = setTimeout(function () {
                        monthlySalesAreaResize();
                    }, 200);
                });

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', monthlySalesAreaResize);
                    });
                }


                
                
                
                
                
                function monthlySalesAreaResize() {

                    
                    width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;


                    
                    

                    
                    container.attr('width', width + margin.left + margin.right);

                    
                    svg.attr('width', width + margin.left + margin.right);


                    
                    

                    
                    x.range([0, width]);

                    
                    svg.selectAll('.d3-axis-horizontal').call(xAxis);

                    
                    svg.selectAll('.d3-axis-subticks').attr('x1', x).attr('x2', x);


                    
                    

                    
                    svg.selectAll('.d3-area').datum(data).attr('d', area);

                    
                    svg.selectAll('.d3-crosshair-overlay').attr('width', width);
                }
            });
        }
    };

    
    var _MessagesAreaChart = function(element, height, color) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var d3Container = d3.select(element),
                margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom;

            
            var parseDate = d3.time.format('%Y-%m-%d').parse;


            
            

            
            var container = d3Container.append('svg');

            
            var svg = container
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


            
            

            
            var area = d3.svg.area()
                .x(function(d) { return x(d.date); })
                .y0(height)
                .y1(function(d) { return y(d.value); })
                .interpolate('monotone')


            
            

            
            var x = d3.time.scale().range([0, width ]);

            
            var y = d3.scale.linear().range([height, 0]);


            
            

            d3.json('../../../assets/demo/data/dashboard/monthly_sales.json', function (error, data) {

                
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



                
                
                

                
                svg.append('path')
                    .datum(data)
                    .attr('class', 'd3-area')
                    .style('fill', color)
                    .attr('d', area)
                    .transition() 
                        .duration(1000)
                        .attrTween('d', function() {
                            var interpolator = d3.interpolateArray(startData, data);
                            return function (t) {
                                return area(interpolator (t));
                            }
                        });


                
                

                
                var resizeMessagesAreaTimer;
                window.addEventListener('resize', function() {
                    clearTimeout(resizeMessagesAreaTimer);
                    resizeMessagesAreaTimer = setTimeout(function () {
                        messagesAreaResize();
                    }, 200);
                });

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', messagesAreaResize);
                    });
                }

                
                
                
                
                
                function messagesAreaResize() {

                    
                    width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;


                    
                    

                    
                    container.attr('width', width + margin.left + margin.right);

                    
                    svg.attr('width', width + margin.left + margin.right);

                    
                    x.range([0, width]);


                    
                    

                    
                    svg.selectAll('.d3-area').datum( data ).attr('d', area);
                }
            });
        }
    };


    
    
    

    return {
        init: function() {
            _MonthlySalesAreaChart('#monthly-sales-stats', 100, '#4DB6AC');
            _MessagesAreaChart('#messages-stats', 40, '#5C6BC0');
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DashboardAreas.init();
});
