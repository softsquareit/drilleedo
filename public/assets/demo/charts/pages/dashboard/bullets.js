





var DashboardBullets = function() {


    
    
    

    
    var _BulletChart = function(element, height) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            function bulletCore() {

                
                d3.bullet = function() {

                    
                    var orient = 'left',
                        reverse = false,
                        duration = 750,
                        ranges = bulletRanges,
                        markers = bulletMarkers,
                        measures = bulletMeasures,
                        height = 30,
                        tickFormat = null;

                    
                    function bullet(g) {
                        g.each(function(d, i) {

                            
                            var rangez = ranges.call(this, d, i).slice().sort(d3.descending),
                                markerz = markers.call(this, d, i).slice().sort(d3.descending),
                                measurez = measures.call(this, d, i).slice().sort(d3.descending),
                                g = d3.select(this);

                            
                            var x1 = d3.scale.linear()
                                .domain([0, Math.max(rangez[0], markerz[0], measurez[0])])
                                .range(reverse ? [width, 0] : [0, width]);

                            
                            var x0 = this.__chart__ || d3.scale.linear()
                                .domain([0, Infinity])
                                .range(x1.range());

                            
                            this.__chart__ = x1;

                            
                            var w0 = bulletWidth(x0),
                                w1 = bulletWidth(x1);



                            
                            

                            
                            var range = g.selectAll('.bullet-range')
                                .data(rangez);

                            
                            range.enter()
                                .append('rect')
                                    .attr('class', function(d, i) { return 'bullet-range bullet-range-' + (i + 1); })
                                    .attr('width', w0)
                                    .attr('height', height)
                                    .attr('rx', 2)
                                    .attr('x', reverse ? x0 : 0)

                            
                            .transition()
                                .duration(duration)
                                .attr('width', w1)
                                .attr('x', reverse ? x1 : 0);

                            
                            range.transition()
                                .duration(duration)
                                .attr('x', reverse ? x1 : 0)
                                .attr('width', w1)
                                .attr('height', height);



                            
                            

                            
                            var measure = g.selectAll('.bullet-measure')
                                .data(measurez);

                            
                            measure.enter()
                                .append('rect')
                                    .attr('class', function(d, i) { return 'bullet-measure bullet-measure-' + (i + 1); })
                                    .attr('width', w0)
                                    .attr('height', height / 5)
                                    .attr('x', reverse ? x0 : 0)
                                    .attr('y', height / 2.5)
                                    .style('shape-rendering', 'crispEdges');

                            
                            measure.transition()
                                .duration(duration)
                                .attr('width', w1)
                                .attr('x', reverse ? x1 : 0);

                            
                            measure.transition()
                                .duration(duration)
                                .attr('width', w1)
                                .attr('height', height / 5)
                                .attr('x', reverse ? x1 : 0)
                                .attr('y', height / 2.5);



                            
                            

                            
                            var marker = g.selectAll('.bullet-marker')
                                .data(markerz);

                            
                            marker.enter()
                                .append('line')
                                    .attr('class', function(d, i) { return 'bullet-marker bullet-marker-' + (i + 1); })
                                    .attr('x1', x0)
                                    .attr('x2', x0)
                                    .attr('y1', height / 6)
                                    .attr('y2', height * 5 / 6);

                            
                            marker.transition()
                                .duration(duration)
                                .attr('x1', x1)
                                .attr('x2', x1);

                            
                            marker.transition()
                                .duration(duration)
                                .attr('x1', x1)
                                .attr('x2', x1)
                                .attr('y1', height / 6)
                                .attr('y2', height * 5 / 6);



                            
                            

                            
                            var format = tickFormat || x1.tickFormat(8);

                            
                            var tick = g.selectAll('.bullet-tick')
                                .data(x1.ticks(8), function(d) {
                                    return this.textContent || format(d);
                                });

                            
                            var tickEnter = tick.enter()
                                .append('g')
                                    .attr('class', 'bullet-tick')
                                    .attr('transform', bulletTranslate(x0))
                                    .style('opacity', 1e-6);

                            
                            tickEnter.append('line')
                                .attr('y1', height)
                                .attr('y2', (height * 7 / 6) + 3);

                            
                            tickEnter.append('text')
                                .attr('text-anchor', 'middle')
                                .attr('dy', '1em')
                                .attr('y', (height * 7 / 6) + 4)
                                .text(format);

                            
                            tickEnter.transition()
                                .duration(duration)
                                .attr('transform', bulletTranslate(x1))
                                .style('opacity', 1);

                            
                            var tickUpdate = tick.transition()
                                .duration(duration)
                                .attr('transform', bulletTranslate(x1))
                                .style('opacity', 1);

                            
                            tickUpdate.select('line')
                                .attr('y1', height + 3)
                                .attr('y2', (height * 7 / 6) + 3);

                            
                            tickUpdate.select('text')
                                .attr('y', (height * 7 / 6) + 4);

                            
                            tick.exit()
                                .transition()
                                    .duration(duration)
                                    .attr('transform', bulletTranslate(x1))
                                    .style('opacity', 1e-6)
                                    .remove();



                            
                            

                            
                            window.addEventListener('resize', resizeBulletsCore);

                            
                            var sidebarToggle = document.querySelector('.sidebar-control');
                            sidebarToggle && sidebarToggle.addEventListener('click', resizeBulletsCore);

                            
                            
                            
                            
                            
                            function resizeBulletsCore() {

                                
                                width = d3.select('#bullets').node().getBoundingClientRect().width - margin.left - margin.right;
                                w1 = bulletWidth(x1);


                                
                                

                                
                                x1.range(reverse ? [width, 0] : [0, width]);


                                
                                

                                
                                g.selectAll('.bullet-measure').attr('width', w1).attr('x', reverse ? x1 : 0);

                                
                                g.selectAll('.bullet-range').attr('width', w1).attr('x', reverse ? x1 : 0);

                                
                                g.selectAll('.bullet-marker').attr('x1', x1).attr('x2', x1)

                                
                                g.selectAll('.bullet-tick').attr('transform', bulletTranslate(x1))
                            }
                        });

                        d3.timer.flush();
                    }


                    
                    

                    
                    bullet.orient = function(x) {
                        if (!arguments.length) return orient;
                        orient = x;
                        reverse = orient == 'right' || orient == 'bottom';
                        return bullet;
                    };

                    
                    bullet.ranges = function(x) {
                        if (!arguments.length) return ranges;
                        ranges = x;
                        return bullet;
                    };

                    
                    bullet.markers = function(x) {
                        if (!arguments.length) return markers;
                        markers = x;
                        return bullet;
                    };

                    
                    bullet.measures = function(x) {
                        if (!arguments.length) return measures;
                        measures = x;
                        return bullet;
                    };

                    
                    bullet.width = function(x) {
                        if (!arguments.length) return width;
                        width = x;
                        return bullet;
                    };

                    
                    bullet.height = function(x) {
                        if (!arguments.length) return height;
                        height = x;
                        return bullet;
                    };

                    
                    bullet.tickFormat = function(x) {
                        if (!arguments.length) return tickFormat;
                        tickFormat = x;
                        return bullet;
                    };

                    
                    bullet.duration = function(x) {
                        if (!arguments.length) return duration;
                        duration = x;
                        return bullet;
                    };

                    return bullet;
                };

                
                function bulletRanges(d) {
                    return d.ranges;
                }

                
                function bulletMarkers(d) {
                    return d.markers;
                }

                
                function bulletMeasures(d) {
                    return d.measures;
                }

                
                function bulletTranslate(x) {
                    return function(d) {
                        return 'translate(' + x(d) + ',0)';
                    };
                }

                
                function bulletWidth(x) {
                    var x0 = x(0);
                    return function(d) {
                        return Math.abs(x(d) - x0);
                    };
                }
            }
            bulletCore();



            
            

            
            var d3Container = d3.select(element),
                margin = {top: 20, right: 10, bottom: 35, left: 10},
                width = width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom;



            
            

            var chart = d3.bullet()
                .width(width)
                .height(height);



            
            

            d3.json('../../../assets/demo/data/dashboard/bullets.json', function(error, data) {

                
                if (error) return console.error(error);


                
                

                
                var container = d3Container.selectAll('svg')
                    .data(data)
                    .enter()
                    .append('svg');

                
                var svg = container
                    .attr('class', function(d, i) { return 'bullet-' + (i + 1); })
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                        .call(chart);



                
                

                
                var title = svg.append('g')
                    .style('text-anchor', 'start');

                
                title.append('text')
                    .attr('class', 'bullet-title')
                    .attr('y', -10)
                    .text(function(d) { return d.title; });

                
                title.append('text')
                    .attr('class', 'bullet-subtitle')
                    .attr('x', width)
                    .attr('y', -10)
                    .style('text-anchor', 'end')
                    .text(function(d) { return d.subtitle; })
                    .style('opacity', 0)
                    .transition()
                        .duration(500)
                        .delay(500)
                        .style('opacity', 0.75);



                
                

                
                var interval = function() {
                    svg.datum(randomize).call(chart.duration(750));
                }

                
                var intervalIds = [];
                intervalIds.push(
                    setInterval(function() {
                        interval()
                    }, 5000)
                );

                
                document.getElementById('realtime').onchange = function() {
                    if(realtime.checked) {
                        intervalIds.push(setInterval(function() { interval() }, 5000));
                    }
                    else {
                        for (var i=0; i < intervalIds.length; i++) {
                            clearInterval(intervalIds[i]);
                        }
                    }
                };



                
                

                
                var resizeBulletTimer;
                window.addEventListener('resize', function() {
                    clearTimeout(resizeBulletTimer);
                    resizeBulletTimer = setTimeout(function () {
                        bulletResize();
                    }, 200);
                });

                
                var sidebarToggle = document.querySelectorAll('.sidebar-control');
                if (sidebarToggle) {
                    sidebarToggle.forEach(function(togglers) {
                        togglers.addEventListener('click', bulletResize);
                    });
                }

                
                
                
                
                
                function bulletResize() {

                    
                    width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;


                    
                    

                    
                    container.attr('width', width + margin.left + margin.right);

                    
                    svg.attr('width', width + margin.left + margin.right);


                    
                    

                    
                    svg.selectAll('.bullet-subtitle').attr('x', width);
                }
            });



            
            

            function randomize(d) {
                if (!d.randomizer) d.randomizer = randomizer(d);
                d.ranges = d.ranges.map(d.randomizer);
                d.markers = d.markers.map(d.randomizer);
                d.measures = d.measures.map(d.randomizer);
                return d;
            }
            function randomizer(d) {
                var k = d3.max(d.ranges) * .2;
                return function(d) {
                    return Math.max(0, d + k * (Math.random() - .5));
                };
            }
        }
    };


    
    
    

    return {
        init: function() {
            _BulletChart("#bullets", 80);
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DashboardBullets.init();
});
