





var EchartsScatterRoamingLight = function() {


    
    
    

    
    var _scatterRoamingLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var scatter_roaming_element = document.getElementById('scatter_roaming');


        
        
        

        if (scatter_roaming_element) {

            
            var scatter_roaming = echarts.init(scatter_roaming_element, null, { renderer: 'svg' });


            
            
            

            
            scatter_roaming.setOption({

                
                textStyle: {
                    fontFamily: 'var(--body-font-family)',
                    color: 'var(--body-color)',
                    fontSize: 14,
                    lineHeight: 22,
                    textBorderColor: 'transparent'
                },

                
                animationDuration: 750,

                
                grid: {
                    left: 0,
                    right: 20,
                    top: 10,
                    bottom: 50,
                    containLabel: true
                },

                
                visualMap: {
                    type: 'continuous',
                    min: 0,
                    max: 100,
                    bottom: 0,
                    left: 'center',
                    text: ['High', 'Low'],
                    textGap: 20,
                    color: ['#FB8C00', '#FFE0B2'],
                    calculable: true,
                    itemWidth: 15,
                    itemHeight: 200,
                    orient: 'horizontal',
                    textStyle: {
                        fontSize: 12,
                        color: '#777'
                    }
                },

                
                tooltip: {
                    trigger: 'axis',
                    className: 'shadow-sm rounded',
                    backgroundColor: 'var(--white)',
                    borderColor: 'var(--gray-400)',
                    padding: 15,
                    textStyle: {
                        color: '#000'
                    },
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: 'var(--gray-600)'
                        }
                    }
                },

                
                axisPointer: [{
                    label: {
                        fontSize: 12
                    },
                    lineStyle: {
                        color: 'var(--gray-600)'
                    }
                }],

                
                xAxis: [{
                    type: 'value',
                    scale: true,
                    axisLabel: {
                        color: 'rgba(var(--body-color-rgb), .65)',
                        formatter: '{value} cm'
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'var(--gray-500)'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'var(--gray-300)',
                            type: 'dashed'
                        }
                    }
                }],

                
                yAxis: [{
                    type: 'value',
                    scale: true,
                    axisLabel: {
                        color: 'rgba(var(--body-color-rgb), .65)',
                        formatter: '{value} kg'
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'var(--gray-500)'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'var(--gray-300)'
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(var(--white-rgb), .01)', 'rgba(var(--black-rgb), .01)']
                        }
                    }
                }],

                
                series: [
                    {
                        name: 'Scatter1',
                        type: 'scatter',
                        data: (function () {
                            var d = [];
                            var len = 500;
                            var value;
                            while (len--) {
                                value = (Math.random()*100).toFixed(2) - 0;
                                d.push([
                                    (Math.random()*value + value).toFixed(2) - 0,
                                    (Math.random()*value).toFixed(2) - 0,
                                    value
                                ]);
                            }
                            return d;
                        })()
                    }
                ]
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            scatter_roaming_element && scatter_roaming.resize();
        };

        
        var sidebarToggle = document.querySelectorAll('.sidebar-control');
        if (sidebarToggle) {
            sidebarToggle.forEach(function(togglers) {
                togglers.addEventListener('click', triggerChartResize);
            });
        }

        
        var resizeCharts;
        window.addEventListener('resize', function() {
            clearTimeout(resizeCharts);
            resizeCharts = setTimeout(function () {
                triggerChartResize();
            }, 200);
        });
    };


    
    
    

    return {
        init: function() {
            _scatterRoamingLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsScatterRoamingLight.init();
});
