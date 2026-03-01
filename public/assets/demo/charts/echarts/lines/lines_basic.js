





var EchartsLinesBasicLight = function() {


    
    
    

    
    var _linesBasicLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var line_basic_element = document.getElementById('line_basic');


        
        
        

        if (line_basic_element) {

            
            var line_basic = echarts.init(line_basic_element, null, { renderer: 'svg' });


            
            
            

            
            line_basic.setOption({

                
                color: ['#EF5350', '#66BB6A'],

                
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
                    right: 40,
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
                        data: [11, 11, 15, 13, 12, 13, 10],
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        markLine: {
                            data: [{
                                type: 'average',
                                name: 'Average'
                            }],
                            label: {
                                color: 'var(--body-color)'
                            }
                        }
                    },
                    {
                        name: 'Minimum',
                        type: 'line',
                        data: [1, -2, 2, 5, 3, 2, 0],
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        markLine: {
                            data: [{
                                type: 'average',
                                name: 'Average'
                            }],
                            label: {
                                color: 'var(--body-color)'
                            }
                        }
                    }
                ]
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            line_basic_element && line_basic.resize();
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
            _linesBasicLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsLinesBasicLight.init();
});
