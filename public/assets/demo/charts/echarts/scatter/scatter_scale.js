





var EchartsScatterScaleLight = function() {


    
    
    

    
    var _scatterScaleSizeLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var scatter_scale_element = document.getElementById('scatter_scale');


        
        
        

        if (scatter_scale_element) {

            
            var scatter_scale = echarts.init(scatter_scale_element, null, { renderer: 'svg' });


            
            
            

            
            scatter_scale.setOption({

                
                color: ['#2ec7c9', '#b6a2de'],

                
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
                    top: 35,
                    bottom: 0,
                    containLabel: true
                },

                
                legend: {
                    data: ['sin', 'cos'],
                    itemGap: 30,
                    textStyle: {
                        color: 'var(--body-color)'
                    }
                },

                
                tooltip: {
                    trigger: 'axis',
                    showDelay : 0,
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
                        name: 'sin',
                        type: 'scatter',
                        large: true,
                        symbolSize: 7,
                        data: (function () {
                            var d = [];
                            var len = 1000;
                            var x = 0;
                            while (len--) {
                                x = (Math.random() * 10).toFixed(3) - 0;
                                d.push([
                                    x,
                                    (Math.sin(x) - x * (len % 2 ? 0.1 : -0.1) * Math.random()).toFixed(3) - 0
                                ]);
                            }
                            return d;
                        })()
                    },
                    {
                        name: 'cos',
                        type: 'scatter',
                        large: true,
                        symbolSize: 6,
                        data: (function () {
                            var d = [];
                            var len = 2000;
                            var x = 0;
                            while (len--) {
                                x = (Math.random() * 10).toFixed(3) - 0;
                                d.push([
                                    x,
                                    (Math.cos(x) - x * (len % 2 ? 0.1 : -0.1) * Math.random()).toFixed(3) - 0
                                ]);
                            }
                            return d;
                        })()
                    }
                ]
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            scatter_scale_element && scatter_scale.resize();
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
            _scatterScaleSizeLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsScatterScaleLight.init();
});
