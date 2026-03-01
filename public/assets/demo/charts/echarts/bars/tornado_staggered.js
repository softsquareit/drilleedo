





var EchartsTornadoStaggeredLight = function() {


    
    
    

    
    var _tornadoStaggeredLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var tornado_staggered_element = document.getElementById('tornado_staggered');


        
        
        

        if (tornado_staggered_element) {

            
            var tornado_staggered = echarts.init(tornado_staggered_element, null, { renderer: 'svg' });


            
            
            

            
            const labelItemRight = {
                normal: {
                    color: '#FF7043',
                    barBorderRadius: [4, 0, 0, 4],
                    label: {
                        position: 'right',
                    }
                }
            };
            const labelTextRight = {
                normal: {
                    color: 'var(--body-color)',
                    fontWeight: 500,
                    fontSize: 12
                }
            };

            
            tornado_staggered.setOption({

                
                textStyle: {
                    fontFamily: 'var(--body-font-family)',
                    color: 'var(--body-color)',
                    fontSize: 14,
                    lineHeight: 22,
                    textBorderColor: 'transparent'
                },

                
                animationDuration: 750,

                
                grid: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 5,
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
                    },
                    formatter: function(params) {
                        return params[0].seriesName + ': ' + params[0].value + ' €';
                    }
                },

                
                xAxis: [{
                    type: 'value',
                    position: 'top',
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
                    axisLine: {
                        lineStyle: {
                            color: 'var(--gray-500)'
                        }
                    },
                    axisLabel: {show: false},
                    axisTick: {show: false},
                    data: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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
                        name: 'Cost of living',
                        type: 'bar',
                        barWidth: 20,
                        itemStyle: {
                            normal: {
                                color: '#66BB6A',
                                barBorderRadius: [0, 4, 4, 0],
                                label: {
                                    show: true,
                                    position: 'left',
                                    padding: [0, 10],
                                    formatter: '{b}',
                                    color: 'var(--body-color)',
                                    fontWeight: 500,
                                    fontSize: 12
                                }
                            }
                        },
                        data: [
                            {value: -680, itemStyle: labelItemRight, label: labelTextRight},
                            {value: -300, itemStyle: labelItemRight, label: labelTextRight},
                            690,
                            900,
                            {value: -390, itemStyle: labelItemRight, label: labelTextRight},
                            600,
                            {value: -120, itemStyle: labelItemRight, label: labelTextRight},
                            700,
                            {value: -120, itemStyle: labelItemRight, label: labelTextRight},
                            900,
                            580,
                            {value: -720, itemStyle: labelItemRight, label: labelTextRight}
                        ]
                    }
                ]
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            tornado_staggered_element && tornado_staggered.resize();
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
            _tornadoStaggeredLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsTornadoStaggeredLight.init();
});
