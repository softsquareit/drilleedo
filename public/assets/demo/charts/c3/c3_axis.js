





const С3Axis = function() {


    
    
    

    
    const _axisExamples = function() {
        if (typeof c3 == 'undefined') {
            console.warn('Warning - c3.min.js is not loaded.');
            return;
        }

        
        const axis_categorized_element = document.getElementById('c3-axis-categorized');
        const axis_additional_element = document.getElementById('c3-axis-additional');
        const axis_tick_culling_element = document.getElementById('c3-axis-tick-culling');
        const axis_tick_rotation_element = document.getElementById('c3-axis-tick-rotation');
        const axis_labels_element = document.getElementById('c3-axis-labels');
        const sidebarToggle = document.querySelectorAll('.sidebar-control');


        
        if(axis_categorized_element) {

            
            const axis_categorized = c3.generate({
                bindto: axis_categorized_element,
                size: { height: 400 },
                data: {
                    columns: [
                        ['data1', 30, 200, 100, 400, 150, 250, 50, 100, 250]
                    ],
                    type: 'spline'
                },
                point: { 
                    r: 4
                },
                color: {
                    pattern: ['#66bb6a']
                },
                axis: {
                    x: {
                        type: 'category',
                        categories: ['cat1', 'cat2', 'cat3', 'cat4', 'cat5', 'cat6', 'cat7', 'cat8', 'cat9']
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
                        axis_categorized.resize();
                    });
                });
            }
        }

        
        if(axis_additional_element) {

            
            const axis_additional = c3.generate({
                bindto: axis_additional_element,
                size: { height: 400 },
                point: { 
                    r: 4
                },
                data: {
                    columns: [
                        ['data1', 30, 200, 100, 400, 150, 250],
                        ['data2', 50, 20, 10, 40, 15, 25]
                    ],
                    axes: {
                        data1: 'y',
                        data2: 'y2'
                    },
                    type: 'spline'
                },
                color: {
                    pattern: ['#5ab1ef', '#d87a80']
                },
                axis: {
                    y2: {
                        show: true
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
                        axis_additional.resize();
                    });
                });
            }
        }

        
        if(axis_tick_culling_element) {

            
            const axis_tick_culling = c3.generate({
                bindto: axis_tick_culling_element,
                size: { height: 400 },
                point: { 
                    r: 4
                },
                data: {
                    columns: [
                        ['sample', 30, 200, 100, 400, 150, 250, 30, 200, 100, 400, 150, 250, 30, 200, 100, 400, 150, 250, 200, 100, 400, 150, 250]
                    ],
                    type: 'spline'
                },
                color: {
                    pattern: ['#ffb980']
                },
                axis: {
                    x: {
                        type: 'category',
                        tick: {
                            culling: {
                                max: 4
                            }
                        }
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
                        axis_tick_culling.resize();
                    });
                });
            }
        }

        
        if(axis_tick_rotation_element) {

            
            const axis_tick_rotation = c3.generate({
                bindto: axis_tick_rotation_element,
                size: { height: 400 },
                data: {
                    x : 'x',
                    columns: [
                        ['x', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                        ['pv', 90, 100, 140, 200, 100, 400, 90, 100, 140, 200, 100, 400],
                    ],
                    type: 'bar'
                },
                color: {
                    pattern: ['#5ab1ef']
                },
                axis: {
                    x: {
                        type: 'category',
                        tick: {
                            rotate: -90
                        },
                        height: 80
                    }
                },
                grid: {
                    x: {
                        show: true
                    }
                }
            });

            
            if (sidebarToggle) {
                sidebarToggle.forEach(function(togglers) {
                    togglers.addEventListener('click', function() {
                        axis_tick_rotation.resize();
                    });
                });
            }
        }

        
        if(axis_labels_element) {

            
            const axis_labels = c3.generate({
                bindto: axis_labels_element,
                size: { height: 400 },
                point: { 
                    r: 4
                },
                data: {
                    columns: [
                        ['sample1', 30, 200, 100, 400, 150, 250],
                        ['sample2', 50, 20, 10, 40, 15, 25]
                    ],
                    axes: {
                        sample1: 'y',
                        sample2: 'y2'
                    },
                    type: 'spline'
                },
                color: {
                    pattern: ['#2ec7c9','#b6a2de']
                },
                axis: {
                    x: {
                        label: 'X Label'
                    },
                    y: {
                        label: 'Y Label'
                    },
                    y2: {
                        show: true,
                        label: 'Y2 Label'
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
                        axis_labels.resize();
                    });
                });
            }
        }
    };


    
    
    

    return {
        init: function() {
            _axisExamples();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    С3Axis.init();
});
