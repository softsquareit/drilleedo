





var EchartsAreaReversedAxisLight = function() {


    
    
    

    
    var _areaReversedAxisLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var area_reversed_axis_element = document.getElementById('area_reversed_axis');


        
        
        

        if (area_reversed_axis_element) {

            
            var area_reversed_axis = echarts.init(area_reversed_axis_element, null, { renderer: 'svg' });


            
            
            

            
            area_reversed_axis.setOption({

                
                color: ['#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80'],

                
                textStyle: {
                    fontFamily: 'var(--body-font-family)',
                    color: 'var(--body-color)',
                    fontSize: 14,
                    lineHeight: 22,
                    textBorderColor: 'transparent'
                },

                
                animationDuration: 750,

                
                grid: {
                    left: 15,
                    right: 30,
                    top: 35,
                    bottom: 5,
                    containLabel: true
                },

                
                legend: {
                    data: ['Flow', 'Rainfall'],
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
                    },
                    formatter: function(params) {
                        return params[0].name + '<br/>'
                        + params[0].seriesName + ': ' + params[0].value + ' (m^3/s)<br/>'
                        + params[1].seriesName + ': ' + -params[1].value + ' (mm)';
                    }
                },

                
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    axisLabel: {
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
                            color: 'var(--gray-300)',
                            type: 'dashed'
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(var(--white-rgb), .01)', 'rgba(var(--black-rgb), .01)']
                        }
                    }
                }],

                
                yAxis: [
                    {
                        name: 'Flow(m^3/s)',
                        type: 'value',
                        max: 500,
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
                    },
                    {
                        name: 'Rainfall(mm)',
                        type: 'value',
                        axisLabel: {
                            color: 'rgba(var(--body-color-rgb), .65)',
                            formatter: function(v) {
                                return - v;
                            }
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
                        }
                    }
                ],

                
                axisPointer: [{
                    lineStyle: {
                        color: 'var(--gray-600)'
                    }
                }],

                
                series: [
                    {
                        name: 'Flow',
                        type: 'line',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        data: [100, 200, 240, 180, 90, 200, 130]
                    },
                    {
                        name: 'Rainfall',
                        type: 'line',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        yAxisIndex: 1,
                        data: (function() {
                            var oriData = [
                                1, 2, 1.5, 7.4, 3.1, 4, 2
                            ];
                            var len = oriData.length;
                            while(len--) {
                                oriData[len] *= -1;
                            }
                            return oriData;
                        })()
                    }
                ]
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            area_reversed_axis_element && area_reversed_axis.resize();
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
            _areaReversedAxisLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsAreaReversedAxisLight.init();
});
