





var EchartsLinesStackedLight = function() {


    
    
    

    
    var _linesStackedLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var line_stacked_element = document.getElementById('line_stacked');


        
        
        

        if (line_stacked_element) {

            
            var line_stacked = echarts.init(line_stacked_element, null, { renderer: 'svg' });


            
            
            

            
            line_stacked.setOption({

                
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
                    right: 25,
                    top: 35,
                    bottom: 10,
                    containLabel: true
                },

                
                legend: {
                    data: ['Edge', 'Opera', 'Safari', 'Firefox', 'Chrome'],
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
                    data: [
                        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
                    ],
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
                        name: 'Edge',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: 'Opera',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: 'Safari',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        data: [150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name: 'Firefox',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        data: [320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name: 'Chrome',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        data: [820, 932, 901, 934, 1290, 1330, 1320]
                    }
                ]
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            line_stacked_element && line_stacked.resize();
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
            _linesStackedLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsLinesStackedLight.init();
});
