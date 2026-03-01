





var D3BarInteraction = function() {


    
    
    

    
    var _barInteraction = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-simple-interaction'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 20, bottom: 20, left: 10},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
            var dataset = [40.5, 33.1, 31.6, 31.0, 29.9, 28.9, 25.2, 25.2, 24.8, 24.3, 24.0, 22.6, 20.5, 19.5, 19.0, 18.9, 18.8, 18.5, 18.4, 17.6, 17.1];

            
            var bar_colors = d3.scale.category20(),
                bar_text_color = '#fff'



            
            

            
            var x = d3.scale.ordinal()
                .domain(d3.range(dataset.length))
                .rangeRoundBands([0, width], 0.05);

            
            var y = d3.scale.linear()
                .domain([0, d3.max(dataset)])
                .range([0, height]);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");



            
            

            
            var container = d3Container.append("svg");

            
            var svg = container
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            
            

            
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) { return d })

            
            svg.call(tip);


            
            
            

            
            

            
            var drawBars = svg.selectAll(".d3-bar")
                .data(dataset)
                .enter()
                .append("rect")
                    .attr("class", "d3-bar")
                    .attr("x", function(d, i) { return x(i) })
                    .attr("width", x.rangeBand())
                    .attr("height", 0)
                    .attr("y", height)
                    .attr("fill", function(d, i) { return bar_colors(i); })
                    .style("cursor", "pointer")
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)

            
            drawBars.transition()
                .delay(200)
                .duration(1000)
                .attr("height", function(d) { return y(d) })
                .attr("y", function(d) { return height - y(d) })


            
            var drawLabels = svg.selectAll(".value-label")
                .data(dataset)
                .enter()
                .append("text")
                    .attr("class", "value-label")
                    .attr("x", function(d, i) { return x(i) + x.rangeBand() / 2 })
                    .attr("y", function(d) { return height - y(d) + 25; })
                    .style('opacity', 0)
                    .style("text-anchor", "middle")
                    .style("fill", bar_text_color)
                    .text(function(d) {return d;});

            
            drawLabels.transition()
                .delay(1000)
                .duration(500)
                .style('opacity', 1);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");



            
            

            d3.select(".toggle-dataset").on("change", function() {
                if(this.checked) {

                    dataset = [8.4, 12.1, 25.5, 10.3, 11.7, 10.9, 13.3, 23.1, 15.4, 12.3, 17.8, 18.8, 14.7, 8.8, 11.2, 10.2, 17.1, 14.5, 11.9, 7.3, 7.4];

                    
                    svg.selectAll("rect")
                        .data(dataset)
                        .transition()
                            .delay(0)
                            .duration(1000)
                            .ease('cubic-in-out')
                            .attr("y", function(d) { return height - y(d) })
                            .attr("height", function(d) { return y(d) })
                            .style("fill", bar_colors)

                    
                    var drawNewlabels = svg.selectAll("text")
                        .data(dataset)
                        .attr("x", function(d, i) {return x(i) + x.rangeBand() / 2 })
                        .attr("y", function(d) {return height - y(d) + 25 })
                        .style('opacity', 0)
                        .text(function(d) {return d;});

                    
                    drawNewlabels.transition()
                        .delay(1000)
                        .duration(500)
                        .style('opacity', 1)
                }
                else {

                    dataset = [40.5, 33.1, 31.6, 31.0, 29.9, 28.9, 25.2, 25.2, 24.8, 24.3, 24.0, 22.6, 20.5, 19.5, 19.0, 18.9, 18.8, 18.5, 18.4, 17.6, 17.1];

                    
                    svg.selectAll("rect")
                        .data(dataset)
                        .transition()
                            .delay(0)
                            .duration(1000)
                            .ease('cubic-in-out')
                            .attr("y", function(d) { return height - y(d) })
                            .attr("height", function(d) { return y(d) })
                            .style("fill", function(d, i) { return bar_colors(i); });


                    
                    var drawFirstlabels = svg.selectAll("text")
                        .data(dataset)
                        .attr("x", function(d, i) {return x(i) + x.rangeBand() / 2 })
                        .attr("y", function(d) {return height - y(d) + 25 })
                        .style('opacity', 0)
                        .text(function(d) {return d;});

                    drawFirstlabels.transition()
                        .delay(1000)
                        .duration(500)
                        .style('opacity', 1);
                }
            });


            
            

            
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


                
                

                
                x.rangeRoundBands([0, width], 0.05);

                
                svg.selectAll('.d3-axis-horizontal').call(xAxis);


                
                

                
                svg.selectAll('.d3-bar').attr("x", function(d, i) { return x(i) }).attr("width", x.rangeBand());

                
                svg.selectAll(".value-label").attr("x", function(d, i) { return x(i) + x.rangeBand() / 2 });
            }
        }
    };


    
    
    

    return {
        init: function() {
            _barInteraction();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3BarInteraction.init();
});
