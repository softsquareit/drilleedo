





var D3AreaMissingData = function() {


    
    
    

    
    var _areaMissingData = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-missing-data'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 20, bottom: 20, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
            var data = d3.range(60).map(function(i) {
              return {x: i / 59, y: i % 5 ? (Math.sin(i / 3) + 2) / 4 : null};
            });

            
            var area_color = '#75c476',
                line_color = '#fd8d3b';



            
            

            
            var x = d3.scale.linear()
                .range([0, width]);

            
            var y = d3.scale.linear()
                .range([height, 0]);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");


            
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return d.x;
                });



            
            

            
            var container = d3Container.append("svg");

            
            var svg = container
                .datum(data)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .call(tip);



            
            

            
            var line = d3.svg.line()
                .defined(function(d) { return d.y != null; })
                .x(function(d) { return x(d.x); })
                .y(function(d) { return y(d.y); });

            
            var area = d3.svg.area()
                .defined(line.defined())
                .x(line.x())
                .y1(line.y())
                .y0(y(0));


            
            
            

            
            

            
            svg.append("g")
                .attr("class", "d3-axis d3-axis-horizontal")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            
            svg.append("g")
                .attr("class", "d3-axis d3-axis-vertical")
                .call(yAxis);


            
            

            
            svg.append("path")
                .attr("class", "d3-area")
                .attr("d", area)
                .style("fill", area_color);


            
            svg.append("path")
                .attr("class", "d3-line d3-line-medium")
                .attr("d", line)
                .style("stroke", line_color);

            
            svg.selectAll(".d3-line-circle")
                .data(data.filter(function(d) { return d.y; }))
                .enter()
                .append("circle")
                    .attr("class", "d3-line-circle d3-line-medium")
                    .attr("cx", line.x())
                    .attr("cy", line.y())
                    .attr("r", 4)
                    .style("stroke", line_color)
                    .style("fill", line_color)
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);



            
            

            
            window.addEventListener('resize', resize);

            
            var sidebarToggle = document.querySelectorAll('.sidebar-control');
            if (sidebarToggle) {
                sidebarToggle.forEach(function(togglers) {
                    togglers.addEventListener('click', resize);
                });
            }

            
            
            
            
            
            function resize() {

                
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;


                
                

                
                container.attr("width", width + margin.left + margin.right);

                
                svg.attr("width", width + margin.left + margin.right);


                
                

                
                x.range([0, width]);

                
                svg.selectAll('.d3-axis-horizontal').call(xAxis);


                
                

                
                svg.selectAll('.d3-line').attr("d", line);

                
                svg.selectAll('.d3-area').attr("d", area);

                
                svg.selectAll('.d3-line-circle').attr("cx", line.x());
            }
        }
    };


    
    
    

    return {
        init: function() {
            _areaMissingData();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3AreaMissingData.init();
});
