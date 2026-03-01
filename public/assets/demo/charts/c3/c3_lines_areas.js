





const С3LinesAreas = function() {


    
    
    

    
    const _linesAreasExamples = function() {
        if (typeof c3 == 'undefined') {
            console.warn('Warning - c3.min.js is not loaded.');
            return;
        }

        
        const line_chart_element = document.getElementById('c3-line-chart');
        const chart_line_regions_element = document.getElementById('c3-line-regions-chart');
        const area_chart_element = document.getElementById('c3-area-chart');
        const area_stacked_chart_element = document.getElementById('c3-area-stacked-chart');
        const step_chart_element = document.getElementById('c3-step-chart');
        const sidebarToggle = document.querySelectorAll('.sidebar-control');


        
        if(line_chart_element) {

            
            const line_chart = c3.generate({
                bindto: line_chart_element,
                point: { 
                    r: 4
                },
                size: { height: 400 },
                color: {
                    pattern: ['#2ec7c9','#b6a2de','#5ab1ef']
                },
                data: {
                    columns: [
                        ['data1', 30, 200, 100, 400, 150, 250],
                        ['data2', 50, 20, 10, 40, 15, 25]
                    ],
                    type: 'spline'
                },
                grid: {
                    y: {
                        show: true
                    }
                }
            });

            
            setTimeout(function () {
                line_chart.load({
                    columns: [
                        ['data1', 230, 190, 300, 500, 300, 400]
                    ]
                });
            }, 3000);
            setTimeout(function () {
                line_chart.load({
                    columns: [
                        ['data3', 130, 150, 200, 300, 200, 100]
                    ]
                });
            }, 6000);
            setTimeout(function () {
                line_chart.unload({
                    ids: 'data1'
                });
            }, 9000);

            
            if (sidebarToggle) {
                sidebarToggle.forEach(function(togglers) {
                    togglers.addEventListener('click', function() {
                        line_chart.resize();
                    });
                });
            }
        }

        
        if(chart_line_regions_element) {

            
            const chart_line_regions = c3.generate({
                bindto: chart_line_regions_element,
                size: { height: 400 },
                point: {
                    r: 4
                },
                color: {
                    pattern: ['#66bb6a', '#ffb980']
                },
                data: {
                    columns: [
                        ['data1', 30, 200, 100, 400, 150, 250],
                        ['data2', 50, 20, 10, 40, 15, 25]
                    ],
                    regions: {
                        'data1': [{'start':1, 'end':2, 'style':'dashed'},{'start':3}],
                        'data2': [{'end':3}]
                    }
                },
                grid: {
                    y: {
                        show: true
                    }
                }
            });

            
            if (sidebarToggle) {
                sidebarToggle.forEach(function(togglers) {
                    togglers.addEventListener('click', function() {
                        chart_line_regions.resize();
                    });
                });
            }
        }

        
        if(area_chart_element) {

            
            const area_chart = c3.generate({
                bindto: area_chart_element,
                size: { height: 400 },
                point: {
                    r: 4
                },
                color: {
                    pattern: ['#2ec7c9','#b6a2de']
                },
                data: {
                    columns: [
                        ['data1', 300, 350, 300, 0, 0, 0],
                        ['data2', 130, 100, 140, 200, 150, 50]
                    ],
                    types: {
                        data1: 'area-spline',
                        data2: 'area-spline'
                    }
                },
                grid: {
                    y: {
                        show: true
                    }
                }
            });

            
            if (sidebarToggle) {
                sidebarToggle.forEach(function(togglers) {
                    togglers.addEventListener('click', function() {
                        area_chart.resize();
                    });
                });
            }
        }

        
        if(area_stacked_chart_element) {

            
            const area_stacked_chart = c3.generate({
                bindto: area_stacked_chart_element,
                size: { height: 400 },
                color: {
                    pattern: ['#2ec7c9','#b6a2de']
                },
                point: {
                    r: 4
                },
                data: {
                    columns: [
                        ['data1', 300, 350, 300, 0, 0, 120],
                        ['data2', 130, 100, 140, 200, 150, 50]
                    ],
                    types: {
                        data1: 'area-spline',
                        data2: 'area-spline'
                    },
                    groups: [['data1', 'data2']]
                },
                grid: {
                    y: {
                        show: true
                    }
                }
            });

            
            if (sidebarToggle) {
                sidebarToggle.forEach(function(togglers) {
                    togglers.addEventListener('click', function() {
                        area_stacked_chart.resize();
                    });
                });
            }
        }

        
        if(step_chart_element) {

            
            const step_chart = c3.generate({
                bindto: step_chart_element,
                size: { height: 400 },
                color: {
                    pattern: ['#ffb980', '#66bb6a']
                },
                data: {
                    columns: [
                        ['data1', 300, 350, 300, 0, 0, 100],
                        ['data2', 130, 100, 140, 200, 150, 50]
                    ],
                    types: {
                        data1: 'step',
                        data2: 'area-step'
                    }
                },
                grid: {
                    y: {
                        show: true
                    }
                }
            });

            
            if (sidebarToggle) {
                sidebarToggle.forEach(function(togglers) {
                    togglers.addEventListener('click', function() {
                        step_chart.resize();
                    });
                });
            }
        }
    };


    
    
    

    return {
        init: function() {
            _linesAreasExamples();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    С3LinesAreas.init();
});
