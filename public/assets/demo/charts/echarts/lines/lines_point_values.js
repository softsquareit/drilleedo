





var EchartsLinesPointValuesLight = function() {


    
    
    

    
    var _linesPointValuesLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var line_values_element = document.getElementById('line_values');


        
        
        

        if (line_values_element) {

            
            var line_values = echarts.init(line_values_element, null, { renderer: 'svg' });


            
            
            

            
            line_values.setOption({

                
                color: ['#49C1B6', '#EA007B'],

                
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
                    right: 30,
                    top: 35,
                    bottom: 0,
                    containLabel: true
                },

                
                legend: {
                    data: ['Maximum', 'Minimum'],
                    itemHeight: 8,
                    itemGap: 30,
                    textStyle: {
                        color: 'var(--body-color)'
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
                        name: 'Maximum',
                        type: 'line',
                        data: [2, 37, 9, 32, -5, 10, 28],
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        label: {
                            normal: {
                                show: true,
                                color: 'var(--body-color)',
                                fontSize: 12
                            } 
                        }
                    },
                    {
                        name: 'Minimum',
                        type: 'line',
                        data: [10, -12, 28, -8, 30, 22, 9],
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        label: {
                            normal: {
                                show: true,
                                color: 'var(--body-color)',
                                fontSize: 12
                            } 
                        }
                    }
                ]
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            line_values_element && line_values.resize();
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
            _linesPointValuesLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsLinesPointValuesLight.init();
});
