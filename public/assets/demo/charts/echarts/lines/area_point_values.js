





var EchartsAreaPointValuesLight = function() {


    
    
    

    
    var _areaPointValuesLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var area_values_element = document.getElementById('area_values');


        
        
        

        if (area_values_element) {

            
            var area_values = echarts.init(area_values_element, null, { renderer: 'svg' });


            
            
            

            
            area_values.setOption({

                
                color: ['#EC407A'],

                
                textStyle: {
                    fontFamily: 'var(--body-font-family)',
                    color: 'var(--body-color)',
                    fontSize: 14,
                    lineHeight: 22,
                    textBorderColor: 'transparent'
                },

                
                animationDuration: 750,

                
                grid: {
                    left: 10,
                    right: 40,
                    top: 10,
                    bottom: 5,
                    containLabel: true
                },

                
                tooltip: {
                    trigger: 'axis',
                    className: 'shadow-sm rounded',
                    backgroundColor: 'var(--white)',
                    borderColor: 'var(--gray-400)',
                    padding: 15,
                    textStyle: {
                        color: '#000'
                    }
                },

                
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisLabel: {
                        color: 'rgba(var(--body-color-rgb), .65)'
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
                    }
                }],

                
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} °C',
                        color: 'rgba(var(--body-color-rgb), .65)'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: 'var(--gray-500)'
                        }
                    },
                    splitLine: {
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

                
                axisPointer: [{
                    lineStyle: {
                        color: 'var(--gray-600)'
                    }
                }],

                
                series: [
                    {
                        name: '',
                        type: 'line',
                        data: [10, 42, 28, 38, 10, 22, 9],
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        label: {
                            normal: {
                                show: true,
                                color: 'var(--body-color)',
                                fontSize: 12
                            } 
                        },
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        }
                    }
                ]
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            area_values_element && area_values.resize();
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
            _areaPointValuesLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsAreaPointValuesLight.init();
});
