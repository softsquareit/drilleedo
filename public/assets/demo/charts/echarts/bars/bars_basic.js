





var EchartsBarsBasicLight = function() {


    
    
    

    
    var _barsBasicLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var bars_basic_element = document.getElementById('bars_basic');


        
        
        

        if (bars_basic_element) {

            
            var bars_basic = echarts.init(bars_basic_element, null, { renderer: 'svg' });


            
            
            

            
            bars_basic.setOption({

                
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
                    right: 30,
                    top: 35,
                    bottom: 0,
                    containLabel: true
                },

                
                legend: {
                    data: ['Year 2013', 'Year 2014'],
                    itemHeight: 8,
                    itemGap: 30,
                    textStyle: {
                        color: 'var(--body-color)',
                        padding: [0, 5]
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
                        type: 'shadow',
                        shadowStyle: {
                            color: 'rgba(var(--body-color-rgb), 0.025)'
                        }
                    }
                },

                
                xAxis: [{
                    type: 'value',
                    boundaryGap: [0, 0.01],
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
                        show: true,
                        lineStyle: {
                            color: 'var(--gray-300)',
                            type: 'dashed'
                        }
                    }
                }],

                
                yAxis: [{
                    type: 'category',
                    data: ['Germany','France','Spain','Netherlands','Belgium'],
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
                        name: 'Year 2013',
                        type: 'bar',
                        itemStyle: {
                            color: '#EF5350',
                            barBorderRadius: [0, 4, 4, 0]
                        },
                        data: [38203, 73489, 129034, 204970, 331744]
                    },
                    {
                        name: 'Year 2014',
                        type: 'bar',
                        itemStyle: {
                            color: '#66BB6A',
                            barBorderRadius: [0, 4, 4, 0]
                        },
                        data: [39325, 83438, 131000, 221594, 334141]
                    }
                ]
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            bars_basic_element && bars_basic.resize();
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
            _barsBasicLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsBarsBasicLight.init();
});
