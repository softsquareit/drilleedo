





var D3Waterfall = function() {


    
    
    

    
    var _waterfall = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-waterfall'),
            height = 400;


        
        if(element) {

            
            

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 10, bottom: 100, left: 50},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom,
                padding = 0.3;

            
            function dollarFormatter(n) {
                n = Math.round(n);
                var result = n;
                if (Math.abs(n) > 1000) {
                    result = Math.round(n/1000) + 'K';
                }
                return '$' + result;
            }

            
            var color_positive = '#EF5350',
                color_negative = '#66BB6A',
                color_total = '#42A5F5',
                color_text = '#fff';



            
            

            
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], padding);

            
            var y = d3.scale.linear()
                .range([height, 0]);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickFormat(function(d) { return dollarFormatter(d); });



            
            

            
            var container = d3Container.append("svg")

            
            var svg = container
                .attr('width', width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            
            

            d3.csv("../../../assets/demo/data/d3/other/waterfall.csv", function(error, data) {

                
                data.forEach(function(d) {
                    d.value = +d.value;
                });

                
                var cumulative = 0;
                for (var i = 0; i < data.length; i++) {
                    data[i].start = cumulative;
                    cumulative += data[i].value;
                    data[i].end = cumulative;
                    data[i].class = ( data[i].value >= 0 ) ? 'positive' : 'negative'
                }
                data.push({
                    name: 'Total',
                    end: cumulative,
                    start: 0,
                    class: 'total'
                });


                
                

                
                x.domain(data.map(function(d) { return d.name; }));

                
                y.domain([0, d3.max(data, function(d) { return d.end; })]);



                
                
                

                
                

                
                svg.append("g")
                    .attr("class", "d3-axis d3-axis-horizontal")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")  
                        .style("text-anchor", "end")
                        .attr("dx", "-15px")
                        .attr("dy", "-6px")
                        .attr("transform", function(d) {
                            return "rotate(-90)" 
                        });

                
                svg.append("g")
                    .attr("class", "d3-axis d3-axis-vertical")
                    .call(yAxis);


                
                

                
                var bar = svg.selectAll(".d3-waterfall-bar")
                    .data(data)
                    .enter()
                    .append("g")
                        .attr("class", function(d) { return "d3-waterfall-bar " + d.class })
                        .attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; });

                
                bar.append("rect")
                    .attr("y", function(d) { return y( Math.max(d.start, d.end) ); })
                    .attr("height", function(d) { return Math.abs( y(d.start) - y(d.end) ); })
                    .attr("width", x.rangeBand());

                
                bar.append("text")
                    .attr("x", x.rangeBand() / 2)
                    .attr("y", function(d) { return y(d.end) + 5; })
                    .attr("dy", function(d) { return ((d.class=='negative') ? '-' : '') + "1.5em" })
                    .style("fill", color_text)
                    .style("text-anchor", "middle")
                    .text(function(d) { return dollarFormatter(d.end - d.start);});

                
                bar.filter(function(d) { return d.class == "positive" }).select('rect').style("fill", color_positive);
                bar.filter(function(d) { return d.class == "negative" }).select('rect').style("fill", color_negative);
                bar.filter(function(d) { return d.class == "total" }).select('rect').style("fill", color_total);

                
                bar.filter(function(d) { return d.class != "total" })
                    .append("line")
                        .attr("class", "d3-waterfall-connector d3-line-connect")
                        .attr("x1", x.rangeBand() + 5 )
                        .attr("y1", function(d) { return y(d.end) })
                        .attr("x2", x.rangeBand() / ( 1 - padding) - 5)
                        .attr("y2", function(d) { return y(d.end) })
                        .style("stroke-dasharray", 3);
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


                
                

                
                x.rangeRoundBands([0, width], padding);

                
                svg.selectAll('.d3-axis-horizontal').call(xAxis).selectAll('text').style("text-anchor", "end").attr("dy", "-6px");


                
                

                
                svg.selectAll(".d3-waterfall-bar").attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; });

                
                svg.selectAll(".d3-waterfall-bar rect").attr("width", x.rangeBand());

                
                svg.selectAll(".d3-waterfall-bar text").attr("x", x.rangeBand() / 2);

                
                svg.selectAll(".d3-waterfall-connector").attr("x1", x.rangeBand() + 5 ).attr("x2", x.rangeBand() / ( 1 - padding) - 5 );
            }
        }
    };


    
    
    

    return {
        init: function() {
            _waterfall();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3Waterfall.init();
});
