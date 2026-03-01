





var DashboardBars = function() {


    
    
    

    
    var _BarChart = function(element, barQty, height, animate, easing, duration, delay, color, tooltip) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var bardata = [];
            for (var i=0; i < barQty; i++) {
                bardata.push(Math.round(Math.random()*10) + 10);
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

            
            if(tooltip == 'hours' || tooltip == 'goal' || tooltip == 'members') {
                bars.call(tip)
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
            }

            
            if(tooltip == 'hours') {
                tip.html(function (d, i) {
                    return '<div class="text-center">' +
                            '<h6 class="m-0">' + d + '</h6>' +
                            '<span class="fs-sm">meetings</span>' +
                            '<div class="fs-sm">' + i + ':00' + '</div>' +
                        '</div>'
                });
            }

            
            if(tooltip == 'goal') {
                tip.html(function (d, i) {
                    return '<div class="text-center">' +
                            '<h6 class="m-0">' + d + '</h6>' +
                            '<span class="fs-sm">statements</span>' +
                            '<div class="fs-sm">' + i + ':00' + '</div>' +
                        '</div>'
                });
            }

            
            if(tooltip == 'members') {
                tip.html(function (d, i) {
                    return '<div class="text-center">' +
                            '<h6 class="m-0">' + d + '0' + '</h6>' +
                            '<span class="fs-sm">members</span>' +
                            '<div class="fs-sm">' + i + ':00' + '</div>' +
                        '</div>'
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
                    })
            }



            
            

            
            var resizeBarsTimer;
            window.addEventListener('resize', function() {
                clearTimeout(resizeBarsTimer);
                resizeBarsTimer = setTimeout(function () {
                    barsResize();
                }, 200);
            });

            
            var sidebarToggle = document.querySelectorAll('.sidebar-control');
            if (sidebarToggle) {
                sidebarToggle.forEach(function(togglers) {
                    togglers.addEventListener('click', barsResize);
                });
            }

            
            
            
            
            
            function barsResize() {

                
                width = d3Container.node().getBoundingClientRect().width;


                
                

                
                container.attr('width', width);

                
                svg.attr('width', width);

                
                x.rangeBands([0, width], 0.3);


                
                

                
                svg.selectAll('.d3-random-bars')
                    .attr('width', x.rangeBand())
                    .attr('x', function(d,i) {
                        return x(i);
                    });
            }
        }
    };


    
    
    

    return {
        init: function() {
            _BarChart('#hours-available-bars', 24, 40, true, 'elastic', 1200, 50, '#EC407A', 'hours');
            _BarChart('#goal-bars', 24, 40, true, 'elastic', 1200, 50, '#5C6BC0', 'goal');
            _BarChart('#members-online', 24, 50, true, 'elastic', 1200, 50, 'rgba(255,255,255,0.5)', 'members');
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DashboardBars.init();
});
