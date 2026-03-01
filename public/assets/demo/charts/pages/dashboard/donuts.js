





var DashboardDonuts = function() {


    
    
    

    
    var _MarketingCampaignsDonutChart = function(element, size) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var data = [
                {
                    "browser": "Google Adwords",
                    "icon": "<i class='ph-google-logo me-2'></i>",
                    "value": 1047
                }, {
                    "browser": "Social media",
                    "icon": "<i class='ph-share-network me-2'></i>",
                    "value": 2948
                }, {
                    "browser": "Youtube video",
                    "icon": "<i class='ph-youtube-logo me-2'></i>",
                    "value": 3909
                }
            ];

            
            var d3Container = d3.select(element),
                distance = 2, 
                radius = (size/2) - distance,
                sum = d3.sum(data, function(d) { return d.value; });

            
            var colorrange = ['#66BB6A','#9575CD','#FF7043'];



            
            

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .direction('e')
                .html(function (d) {
                    return '<ul class="list-unstyled mb-1">' +
                        '<li>' + '<div class="fs-base mb-1 mt-1">' + d.data.icon + d.data.browser + '</div>' + '</li>' +
                        '<li>' + 'Visits: &nbsp;' + '<span class="fw-semibold float-end">' + d.value + '</span>' + '</li>' +
                        '<li>' + 'Share: &nbsp;' + '<span class="fw-semibold float-end">' + (100 / (sum / d.value)).toFixed(2) + '%' + '</span>' + '</li>' +
                    '</ul>';
                });


            
            

            
            var container = d3Container.append('svg').call(tip);
            
            
            var svg = container
                .attr('width', size)
                .attr('height', size)
                .append('g')
                    .attr('transform', 'translate(' + (size / 2) + ',' + (size / 2) + ')');  



            
            

            
            var pie = d3.layout.pie()
                .sort(null)
                .startAngle(Math.PI)
                .endAngle(3 * Math.PI)
                .value(function (d) { 
                    return d.value;
                }); 

            
            var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(radius / 2);

            
            var colors = d3.scale.ordinal().range(colorrange);



            
            
            

            
            var arcGroup = svg.selectAll('.d3-arc')
                .data(pie(data))
                .enter()
                .append('g') 
                    .attr('class', 'd3-arc d3-slice-border')
                    .style('cursor', 'pointer');
            
            
            var arcPath = arcGroup
                .append('path')
                .style('fill', function (d) { return colors(d.data.value); });

            
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

                .on('mousemove', function (d) {
                    
                    
                    tip.show(d)
                        .style('top', (d3.event.pageY - 40) + 'px')
                        .style('left', (d3.event.pageX + 30) + 'px');
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
                    .attrTween('d', function(d) {
                        var interpolate = d3.interpolate(d.startAngle,d.endAngle);
                        return function(t) {
                            d.endAngle = interpolate(t);
                            return arc(d);  
                        }; 
                    });
        }
    };

    
    var _CampaignStatusDonutChart = function(element, size) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var data = [
                {
                    "status": "Active campaigns",
                    "icon": "<i class='ph-check-circle text-success me-2'></i>",
                    "value": 439
                }, {
                    "status": "Closed campaigns",
                    "icon": "<i class='ph-x text-danger me-2'></i>",
                    "value": 290
                }, {
                    "status": "Pending campaigns",
                    "icon": "<i class='ph-clock-counter-clockwise text-primary me-2'></i>",
                    "value": 190
                }, {
                    "status": "Campaigns on hold",
                    "icon": "<i class='ph-infinity text-muted me-2'></i>",
                    "value": 148
                }
            ];

            
            var d3Container = d3.select(element),
                distance = 2, 
                radius = (size/2) - distance,
                sum = d3.sum(data, function(d) { return d.value; });

            
            var colorrange = ['#29B6F6', '#EF5350', '#81C784', '#999'];



            
            

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .direction('e')
                .html(function (d) {
                    return '<ul class="list-unstyled mb-1">' +
                        '<li>' + '<div class="fs-base mb-1 mt-1">' + d.data.icon + d.data.status + '</div>' + '</li>' +
                        '<li>' + 'Total: &nbsp;' + '<span class="fw-semibold float-end">' + d.value + '</span>' + '</li>' +
                        '<li>' + 'Share: &nbsp;' + '<span class="fw-semibold float-end">' + (100 / (sum / d.value)).toFixed(2) + '%' + '</span>' + '</li>' +
                    '</ul>';
                });



            
            

            
            var container = d3Container.append('svg').call(tip);
            
            
            var svg = container
                .attr('width', size)
                .attr('height', size)
                .append('g')
                    .attr('transform', 'translate(' + (size / 2) + ',' + (size / 2) + ')');  



            
            

            
            var pie = d3.layout.pie()
                .sort(null)
                .startAngle(Math.PI)
                .endAngle(3 * Math.PI)
                .value(function (d) { 
                    return d.value;
                }); 

            
            var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(radius / 2);

            
            var colors = d3.scale.ordinal().range(colorrange);



            
            
            

            
            var arcGroup = svg.selectAll('.d3-arc')
                .data(pie(data))
                .enter()
                .append('g') 
                    .attr('class', 'd3-arc d3-slice-border')
                    .style('cursor', 'pointer');
            
            
            var arcPath = arcGroup
                .append('path')
                .style('fill', function (d) { return colors(d.data.value); });

            
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

                .on('mousemove', function (d) {
                    
                    
                    tip.show(d)
                        .style('top', (d3.event.pageY - 40) + 'px')
                        .style('left', (d3.event.pageX + 30) + 'px');
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
                    .attrTween('d', function(d) {
                        var interpolate = d3.interpolate(d.startAngle,d.endAngle);
                        return function(t) {
                            d.endAngle = interpolate(t);
                            return arc(d);  
                        }; 
                    });
        }
    };

    
    var _TicketStatusDonutChart = function(element, size) {
        if (typeof d3 == 'undefined') {
            console.warn('Warning - d3.min.js is not loaded.');
            return;
        }

        
        if(element) {


            
            

            
            var data = [
                {
                    "status": "Pending tickets",
                    "icon": "<i class='ph-clock-counter-clockwise text-primary me-2'></i>",
                    "value": 295
                }, {
                    "status": "Resolved tickets",
                    "icon": "<i class='ph-check-circle text-success me-2'></i>",
                    "value": 189
                }, {
                    "status": "Closed tickets",
                    "icon": "<i class='ph-x text-danger me-2'></i>",
                    "value": 277
                }
            ];

            
            var d3Container = d3.select(element),
                distance = 2, 
                radius = (size/2) - distance,
                sum = d3.sum(data, function(d) { return d.value; });

            
            var colorrange = ['#29B6F6','#66BB6A','#EF5350'];



            
            

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .direction('e')
                .html(function (d) {
                    return '<ul class="list-unstyled mb-1">' +
                        '<li>' + '<div class="fs-base mb-1 mt-1">' + d.data.icon + d.data.status + '</div>' + '</li>' +
                        '<li>' + 'Total: &nbsp;' + '<span class="fw-semibold float-end">' + d.value + '</span>' + '</li>' +
                        '<li>' + 'Share: &nbsp;' + '<span class="fw-semibold float-end">' + (100 / (sum / d.value)).toFixed(2) + '%' + '</span>' + '</li>' +
                    '</ul>';
                });



            
            

            
            var container = d3Container.append('svg').call(tip);
            
            
            var svg = container
                .attr('width', size)
                .attr('height', size)
                .append('g')
                    .attr('transform', 'translate(' + (size / 2) + ',' + (size / 2) + ')');  



            
            

            
            var pie = d3.layout.pie()
                .sort(null)
                .startAngle(Math.PI)
                .endAngle(3 * Math.PI)
                .value(function (d) { 
                    return d.value;
                }); 

            
            var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(radius / 2);

            
            var colors = d3.scale.ordinal().range(colorrange);


            
            
            

            
            var arcGroup = svg.selectAll('.d3-arc')
                .data(pie(data))
                .enter()
                .append('g') 
                    .attr('class', 'd3-arc d3-slice-border')
                    .style('cursor', 'pointer');
            
            
            var arcPath = arcGroup
                .append('path')
                .style('fill', function (d) { return colors(d.data.value); });

            
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

                .on('mousemove', function (d) {
                    
                    
                    tip.show(d)
                        .style('top', (d3.event.pageY - 40) + 'px')
                        .style('left', (d3.event.pageX + 30) + 'px');
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
                    .attrTween('d', function(d) {
                        var interpolate = d3.interpolate(d.startAngle,d.endAngle);
                        return function(t) {
                            d.endAngle = interpolate(t);
                            return arc(d);  
                        }; 
                    });
        }
    };


    
    
    

    return {
        init: function() {
            _MarketingCampaignsDonutChart('#campaigns-donut', 44);
            _CampaignStatusDonutChart('#campaign-status-pie', 44);
            _TicketStatusDonutChart('#tickets-status', 44);
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DashboardDonuts.init();
});
