





const ContentWidgets = function() {


    
    
    

    
    const _componentDropzone = function() {
        if (typeof Dropzone == 'undefined') {
            console.warn('Warning - dropzone.min.js is not loaded.');
            return;
        }

        
        let dropzoneMultiple = new Dropzone("#dropzone_multiple", {
            url: "#",
            paramName: "file", 
            dictDefaultMessage: 'Drop files to upload <div>or CLICK</div>',
            maxFilesize: 0.1 
        });
    };

    
    const _componentDatepicker = function() {
        if (typeof Datepicker == 'undefined') {
            console.warn('Warning - datepicker.min.js is not loaded.');
            return;
        }

        
        const dpBasicElement = document.querySelector('.form-control-datepicker');
        if(dpBasicElement) {
            const dpBasic = new Datepicker(dpBasicElement, {
                container: '.content-inner',
                buttonClass: 'btn',
                prevArrow: document.dir == 'rtl' ? '&rarr;' : '&larr;',
                nextArrow: document.dir == 'rtl' ? '&larr;' : '&rarr;'
            });
        }
    };

    
    const _chatMessagesStats = function() {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        var element = document.getElementById('messages-stats'),
            height = 60,
            color = '#26A69A';


        
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


                
                

                
                window.addEventListener('resize', messagesAreaResize);

                
                document.querySelectorAll('.sidebar-control').forEach(function(toggler) {
                    toggler.addEventListener('click', messagesAreaResize);
                })

                
                
                
                
                
                function messagesAreaResize() {

                    
                    width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;


                    
                    

                    
                    container.attr("width", width + margin.left + margin.right);

                    
                    svg.attr("width", width + margin.left + margin.right);

                    
                    x.range([0, width]);


                    
                    

                    
                    svg.selectAll('.d3-area').datum( data ).attr("d", area);
                }
            });
        }
    };


    
    
    

    return {
        init: function() {
            _componentDatepicker();
            _chatMessagesStats();
            _componentDropzone();
        }
    }
}();






document.addEventListener('DOMContentLoaded', function() {
    ContentWidgets.init();
});
