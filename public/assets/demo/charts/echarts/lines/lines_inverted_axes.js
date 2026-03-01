





var EchartsLinesInvertedAxesLight = function() {


    
    
    

    
    var _linesInvertedAxesLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var line_inverted_axes_element = document.getElementById('line_inverted_axes');


        
        
        

        if (line_inverted_axes_element) {

            
            var line_inverted_axes = echarts.init(line_inverted_axes_element, null, { renderer: 'svg' });


            
            
            

            
            line_inverted_axes.setOption({

                
                color: ['#0092ff'],

                
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
                    top: 35,
                    bottom: 0,
                    containLabel: true
                },

                
                legend: {
                    data: ['Altitude(km) and temperature(°C)'],
                    itemHeight: 8,
                    itemGap: 30,
                    textStyle: {
                        color: 'var(--body-color)'
                    }
                },

                
                tooltip: {
                    trigger: 'axis',
                    formatter: 'Temperature: <br/>{b}km: {c}°C',
                    className: 'shadow-sm rounded',
                    backgroundColor: 'var(--white)',
                    borderColor: 'var(--gray-400)',
                    padding: 15,
                    textStyle: {
                        color: '#000'
                    }
                },

                
                xAxis: [{
                    type: 'value',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisLabel: {
                        color: 'rgba(var(--body-color-rgb), .65)',
                        formatter: '{value} °C'
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

                
                yAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    axisLabel: {
                        formatter: '{value} km',
                        color: 'rgba(var(--body-color-rgb), .65)'
                    },
                    axisLine: {
                        onZero: false,
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
                    data: [
                        0, 10, 20, 30, 40, 50, 60, 70, 80
                    ]
                }],

                
                axisPointer: [{
                    lineStyle: {
                        color: 'var(--gray-600)'
                    }
                }],

                
                series: [
                    {
                        name: 'Altitude(km) and temperature(°C)',
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        data: [
                            15, -50, -56.5, -46.5, -22.1, -2.5, -27.7, -55.7, -76.5
                        ]
                    }
                ]
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            line_inverted_axes_element && line_inverted_axes.resize();
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
            _linesInvertedAxesLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsLinesInvertedAxesLight.init();
});
