





var EchartsCustomBalanceStatsLight = function() {


    
    
    

    
    var _customBalanceStatsLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var balance_statistics_element = document.getElementById('balance_statistics');


        
        
        

        if (balance_statistics_element) {

            
            var balance_statistics = echarts.init(balance_statistics_element, null, { renderer: 'svg' });


            
            
            

            
            var labelRight = {
                normal: {
                    color: '#FF7043',
                    label: {
                        position: 'right'
                    }
                }
            };

            
            balance_statistics.setOption({

                
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
                    right: 10,
                    top: 30,
                    bottom: 0,
                    containLabel: true
                },

                
                legend: {
                    data: ['Income', 'Outcome'],
                    itemHeight: 8,
                    itemGap: 20,
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
                    type: 'category',
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
                        name: 'Income',
                        type: 'bar',
                        barCategoryGap: '50%',
                        label: {
                            position: 'left',
                            show: false,
                            formatter: '{b}',
                            height: 30
                        },
                        itemStyle: {
                            color: '#456db3',
                            barBorderRadius: [0, 3, 3, 0]
                        },
                        data: [190, 122, 160, 240, 110, 180, 280]
                    },
                    {
                        name: 'Outcome',
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        silent: true,
                        data: [120, 180, 30, 137, 90, 230, 120],
                        itemStyle: {
                            color: '#fac858',
                            borderWidth: 2
                        }
                    }
                ]
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            balance_statistics_element && balance_statistics.resize();
        };

        
        var sidebarToggle = document.querySelectorAll('.sidebar-control');
        if (sidebarToggle) {
            sidebarToggle.forEach(function(togglers) {
                togglers.addEventListener('click', triggerChartResize);
            });
        }

        
        var sidebarMobileToggle = document.querySelectorAll('.navbar-toggler');
        if (sidebarMobileToggle) {
            sidebarMobileToggle.forEach(function(toggler) {
                toggler.addEventListener('click', triggerChartResize);
            });
        }

        
        document.querySelectorAll('[data-bs-toggle="tab"]').forEach(function(tabs) {
            tabs.addEventListener('shown.bs.tab', triggerChartResize);
        });

        
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
            _customBalanceStatsLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsCustomBalanceStatsLight.init();
});
