





var D3Streamgraph = function() {


    
    
    

    
    var _streamgraph = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('traffic-sources'),
            height = 340;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 50, bottom: 40, left: 50},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom,
                tooltipOffset = 30;

            
            var tooltip = d3Container
                .append("div")
                .attr("class", "d3-tip e")
                .style("display", "none")

            
            var format = d3.time.format("%m/%d/%y %H:%M");
            var formatDate = d3.time.format("%H:%M");


            
            var colors = d3Container
                .append('style')
                .attr('type', 'text/css')
                .html(`
                    .streamgraph-layers-group {
                        --sg-color-1: #03A9F4;
                        --sg-color-2: #29B6F6;
                        --sg-color-3: #4FC3F7;
                        --sg-color-4: #81D4FA;
                        --sg-color-5: #B3E5FC;
                        --sg-color-6: #E1F5FE;
                    }

                    [data-color-theme="dark"] .streamgraph-layers-group {
                        --sg-color-1: #225ea8;
                        --sg-color-2: #1e90c0;
                        --sg-color-3: #40b6c4;
                        --sg-color-4: #7fcdbb;
                        --sg-color-5: #c7e8b4;
                        --sg-color-6: #edf8b1;
                    }
                `);

            
            var colorrange = ['var(--sg-color-1)', 'var(--sg-color-2)', 'var(--sg-color-3)', 'var(--sg-color-4)', 'var(--sg-color-5)', 'var(--sg-color-6)'];



            
            

            
            var x = d3.time.scale().range([0, width]);

            
            var y = d3.scale.linear().range([height, 0]);

            
            var z = d3.scale.ordinal().range(colorrange);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(d3.time.hours, 4)
                .innerTickSize(4)
                .tickPadding(8)
                .tickFormat(d3.time.format("%H:%M")); 

            
            var yAxis = d3.svg.axis()
                .scale(y)
                .ticks(6)
                .innerTickSize(4)
                .outerTickSize(0)
                .tickPadding(8)
                .tickFormat(function (d) { return (d/1000) + "k"; });

            
            var yAxis2 = yAxis;

            
            var gridAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(6)
                .tickPadding(8)
                .tickFormat("")
                .tickSize(-width, 0, 0);



            
            

            
            var container = d3Container.append("svg")

            
            var svg = container
                .attr('width', width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            
            

            
            var stack = d3.layout.stack()
                .offset("silhouette")
                .values(function(d) { return d.values; })
                .x(function(d) { return d.date; })
                .y(function(d) { return d.value; });

            
            var nest = d3.nest()
                .key(function(d) { return d.key; });

            
            var area = d3.svg.area()
                .interpolate("cardinal")
                .x(function(d) { return x(d.date); })
                .y0(function(d) { return y(d.y0); })
                .y1(function(d) { return y(d.y0 + d.y); });



            
            

            d3.csv("../../../assets/demo/data/dashboard/traffic_sources.csv", function (error, data) {

                
                data.forEach(function (d) {
                    d.date = format.parse(d.date);
                    d.value = +d.value;
                });

                
                var layers = stack(nest.entries(data));



                
                

                
                x.domain(d3.extent(data, function(d, i) { return d.date; }));

                
                y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);



                
                

                
                svg.append("g")
                    .attr("class", "d3-grid-dashed")
                    .call(gridAxis);



                
                
                

                
                

                
                var group = svg.append('g')
                    .attr('class', 'streamgraph-layers-group');

                
                var layer = group.selectAll(".streamgraph-layer")
                    .data(layers)
                    .enter()
                        .append("path")
                        .attr("class", "streamgraph-layer d3-slice-border")
                        .attr("d", function(d) { return area(d.values); })                    
                        .style('stroke-width', 1)
                        .style('box-shadow', '0 4px 8px rgba(0,0,0,0.5)')
                        .style("fill", function(d, i) { return z(i); });

                
                var layerTransition = layer
                    .style('opacity', 0)
                    .transition()
                        .duration(750)
                        .delay(function(d, i) { return i * 50; })
                        .style('opacity', 1)



                
                

                
                
                

                svg.append("g")
                    .attr("class", "d3-axis d3-axis-left")
                    .call(yAxis.orient("left"));

                
                d3.select(svg.selectAll('.d3-axis-left .tick text')[0][0])
                    .style("visibility", "hidden");


                
                
                

                svg.append("g")
                    .attr("class", "d3-axis d3-axis-right")
                    .attr("transform", "translate(" + width + ", 0)")
                    .call(yAxis2.orient("right"));

                
                d3.select(svg.selectAll('.d3-axis-right .tick text')[0][0])
                    .style("visibility", "hidden");


                
                
                

                var xaxisg = svg.append("g")
                    .attr("class", "d3-axis d3-axis-horizontal")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                
                xaxisg.selectAll(".d3-axis-subticks")
                    .data(x.ticks(d3.time.hours), function(d) { return d; })
                    .enter()
                    .append("line")
                    .attr("class", "d3-axis-subticks")
                    .attr("y1", 0)
                    .attr("y2", 4)
                    .attr("x1", x)
                    .attr("x2", x);



                
                

                
                var hoverLineGroup = group.append("g")
                    .attr("class", "hover-line");

                
                var hoverLine = hoverLineGroup
                    .append("line")
                    .attr("class", "d3-crosshair-line")
                    .attr("y1", 0)
                    .attr("y2", height)
                    .style("opacity", 0);

                
                var hoverPointer = hoverLineGroup
                    .append("rect")
                    .attr("class", "d3-crosshair-line")
                    .attr("x", 2)
                    .attr("y", 2)
                    .attr("width", 6)
                    .attr("height", 6)
                    .style('fill', '#03A9F4')
                    .style("opacity", 0);



                
                

                layerTransition.each("end", function() {
                    layer
                        .on("mouseover", function (d, i) {
                            svg.selectAll(".streamgraph-layer")
                                .transition()
                                .duration(250)
                                .style("opacity", function (d, j) {
                                    return j != i ? 0.75 : 1; 
                                });
                        })

                        .on("mousemove", function (d, i) {
                            mouse = d3.mouse(this);
                            mousex = mouse[0];
                            mousey = mouse[1];
                            datearray = [];
                            var invertedx = x.invert(mousex);
                            invertedx = invertedx.getHours();
                            var selected = (d.values);
                            for (var k = 0; k < selected.length; k++) {
                                datearray[k] = selected[k].date
                                datearray[k] = datearray[k].getHours();
                            }
                            mousedate = datearray.indexOf(invertedx);
                            pro = d.values[mousedate].value;


                            
                            hoverPointer
                                .attr("x", mousex - 3)
                                .attr("y", mousey - 6)
                                .style("opacity", 1);

                            hoverLine
                                .attr("x1", mousex)
                                .attr("x2", mousex)
                                .style("opacity", 1);

                            
                            
                            

                            
                            tooltip.html(
                                '<ul class="list-unstyled mb-1 p-0">' +
                                    '<li>' + '<div class="fs-base my-1"><i class="ph-arrow-circle-left"></i><span class="d-inline-block ms-2"></span>' + d.key + '</div>' + '</li>' +
                                    '<li>' + 'Visits: &nbsp;' + "<span class='fw-semibold float-end'>" + pro + '</span>' + '</li>' +
                                    '<li>' + 'Time: &nbsp; ' + '<span class="fw-semibold float-end">' + formatDate(d.values[mousedate].date) + '</span>' + '</li>' + 
                                '</ul>'
                            )
                            .style("display", "block");

                            
                            tooltip.append('div').attr('class', 'd3-tip-arrow');
                        })

                        .on("mouseout", function (d, i) {

                            
                            svg.selectAll(".streamgraph-layer")
                                .transition()
                                .duration(250)
                                .style("opacity", 1);

                            
                            hoverPointer.style("opacity", 0);

                            
                            tooltip.style("display", "none");

                            hoverLine.style("opacity", 0);
                        });
                    });



                
                

                d3Container
                    .on("mousemove", function (d, i) {
                        mouse = d3.mouse(this);
                        mousex = mouse[0];
                        mousey = mouse[1];

                        
                        tooltip.style("top", (mousey - (this.querySelector('.d3-tip').getBoundingClientRect().height / 2)) - 2 + "px") 

                        
                        if(mousex >= (this.getBoundingClientRect().width - this.querySelector('.d3-tip').getBoundingClientRect().width - margin.right - (tooltipOffset * 2))) {
                            tooltip
                                .style("left", (mousex - this.querySelector('.d3-tip').getBoundingClientRect().width - tooltipOffset) + "px") 
                                .attr("class", "d3-tip w");
                        }
                        else {
                            tooltip
                                .style("left", (mousex + tooltipOffset) + "px" )
                                .attr("class", "d3-tip e");
                        }
                    });
            });



            
            

            
            var resizeStreamTimer;
            window.addEventListener('resize', function() {
                clearTimeout(resizeStreamTimer);
                resizeStreamTimer = setTimeout(function () {
                    resizeStream();
                }, 200);
            });

            
            var sidebarToggle = document.querySelectorAll('.sidebar-control');
            if (sidebarToggle) {
                sidebarToggle.forEach(function(togglers) {
                    togglers.addEventListener('click', resizeStream);
                });
            }

            
            
            
            
            
            function resizeStream() {

                
                

                
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;

                
                container.attr("width", width + margin.left + margin.right);

                
                svg.attr("width", width + margin.left + margin.right);

                
                x.range([0, width]);


                
                

                
                svg.selectAll('.d3-axis-horizontal').call(xAxis);

                
                svg.selectAll('.d3-axis-subticks').attr("x1", x).attr("x2", x);

                
                svg.selectAll(".d3-grid-dashed").call(gridAxis.tickSize(-width, 0, 0))

                
                svg.selectAll(".d3-axis-right").attr("transform", "translate(" + width + ", 0)");

                
                svg.selectAll('.streamgraph-layer').attr("d", function(d) { return area(d.values); });
            }
        }
    };


    
    
    

    return {
        init: function() {
            _streamgraph();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3Streamgraph.init();
});
