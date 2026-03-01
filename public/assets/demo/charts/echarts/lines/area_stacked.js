





var EchartsAreaStackedLight = function() {


    
    
    

    
    var _areaStackedLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var area_stacked_element = document.getElementById('area_stacked');


        
        
        

        if (area_stacked_element) {

            
            var area_stacked = echarts.init(area_stacked_element, null, { renderer: 'svg' });


            
            
            

            
            area_stacked.setOption({

                
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
                    left: 10,
                    right: 40,
                    top: 35,
                    bottom: 5,
                    containLabel: true
                },

                
                legend: {
                    data: ['Internet Explorer', 'Safari', 'Firefox', 'Chrome'],
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
                    data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
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
                            color: 'var(--gray-300)',
                            type: 'dashed'
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
                        name: 'Internet Explorer',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        data: [120, 132, 101, 134, 490, 230, 210]
                    },
                    {
                        name: 'Safari',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        data: [150, 1232, 901, 154, 190, 330, 810]
                    },
                    {
                        name: 'Firefox',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        data: [320, 1332, 1801, 1334, 590, 830, 1220]
                    },
                    {
                        name: 'Chrome',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        data: [820, 1632, 1901, 2234, 1290, 1330, 1320]
                    }
                ]
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            area_stacked_element && area_stacked.resize();
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
            _areaStackedLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsAreaStackedLight.init();
});
