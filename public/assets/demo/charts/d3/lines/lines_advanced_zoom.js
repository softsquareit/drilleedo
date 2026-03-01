





var D3PanZoom = function() {


    
    
    

    
    var _linePanZoom = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('d3-pan-zoom'),
            height = 400;


        
        if(element) {

            
            

            
            var data =  [
                [{'x':1,'y':0},{'x':2,'y':5},{'x':3,'y':10},{'x':4,'y':0},{'x':5,'y':6},{'x':6,'y':11},{'x':7,'y':9},{'x':8,'y':4},{'x':9,'y':11},{'x':10,'y':2}],
                [{'x':1,'y':1},{'x':2,'y':6},{'x':3,'y':11},{'x':4,'y':1},{'x':5,'y':7},{'x':6,'y':12},{'x':7,'y':8},{'x':8,'y':3},{'x':9,'y':13},{'x':10,'y':3}],
                [{'x':1,'y':2},{'x':2,'y':7},{'x':3,'y':12},{'x':4,'y':2},{'x':5,'y':8},{'x':6,'y':13},{'x':7,'y':7},{'x':8,'y':2},{'x':9,'y':4},{'x':10,'y':7}]
            ];

            
            var d3Container = d3.select(element),
                margin = {top: 5, right: 20, bottom: 20, left: 40},
                width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
                height = height - margin.top - margin.bottom - 5;

            
            var colors = ['#EF5350', '#5C6BC0', '#66BB6A']

       

            
            

            
            var x = d3.scale.linear()
                .domain([0, 11])
                .range([0, width]);

            
            var y = d3.scale.linear()
                .domain([-1, 14])
                .range([height, 0]);



            
            

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .tickSize(-height)
                .tickPadding(10)  
                .tickSubdivide(true)  
                .orient("bottom");  

            
            var yAxis = d3.svg.axis()
                .scale(y)
                .tickPadding(10)
                .tickSize(-width)
                .tickSubdivide(true)  
                .orient("left");



            
            

            var zoom = d3.behavior.zoom()
                .x(x)
                .y(y)
                .scaleExtent([1, 10])
                .on("zoom", zoomed);  



            
            

            
            var container = d3Container.append("svg");

            
            var svg = container
                .call(zoom)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            
            

            
            var line = d3.svg.line()
                .interpolate("monotone")
                .x(function(d) { return x(d.x); })
                .y(function(d) { return y(d.y); });



            
            
            

            
            

            
            svg.append("g")
                .attr("class", "d3-axis d3-axis-horizontal d3-grid")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            
            svg.append("g")
                .attr("class", "d3-axis d3-axis-vertical d3-grid")
                .call(yAxis);


            
            

            
            svg.append("clipPath")
                .attr("id", "zoom-clip")
                .append("rect")
                    .attr("width", width)
                    .attr("height", height);

            
            var path = svg.selectAll('.d3-line')
                .data(data)
                .enter()
                .append("path")
                    .attr("d", line)
                    .attr("class", "d3-line d3-line-medium")
                    .attr("clip-path", "url(#zoom-clip)")
                    .style('stroke', function(d,i){      
                        return colors[i%colors.length];
                    });


            
            

            
            var points = svg.selectAll('.d3-line-circles')
                .data(data)
                .enter()
                .append("g")
                    .attr("class", "d3-line-circles")
                    .attr("clip-path", "url(#clip)");

            
            points.selectAll('.d3-line-circle')
                .data(function(d, index) {     
                    var a = [];
                    d.forEach(function(point,i) {
                        a.push({'index': index, 'point': point});
                    });   
                    return a;
                })
                .enter()
                .append('circle')
                    .attr('class', 'd3-line-circle d3-line-medium')
                    .attr("r", 4)
                    .attr("transform", function(d) { 
                        return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")"; }
                    )
                    .style('stroke', function(d,i){  
                        return colors[d.index%colors.length];
                    })  
                    .style('fill', function(d,i){  
                        return colors[d.index%colors.length];
                    })  
                    .style("cursor", "pointer");


            
            

            function zoomed() {
                svg.select(".d3-axis-horizontal").call(xAxis);
                svg.select(".d3-axis-vertical").call(yAxis);   
                svg.selectAll('.d3-line').attr('d', line); 

                points.selectAll('.d3-line-circle').attr("transform", function(d) { 
                    return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")"; }
                );  
            }



            
            

            
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

                svg.selectAll('.d3-axis-vertical').call(yAxis.tickSize(-width));


                
                

                
                svg.select('#zoom-clip rect').attr("width", width);

                
                svg.selectAll('.d3-line').attr("d", line);

                
                points.selectAll('.d3-line-circle').attr("transform", function(d) { 
                    return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")"; }
                );
            }
        }
    };


    
    
    

    return {
        init: function() {
            _linePanZoom();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    D3PanZoom.init();
});
