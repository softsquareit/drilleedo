





var EchartsWaterfallChangeLight = function() {


    
    
    

    
    var _waterfallChangeLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var columns_change_waterfall_element = document.getElementById('columns_change_waterfall');


        
        
        

        if (columns_change_waterfall_element) {

            
            var columns_change_waterfall = echarts.init(columns_change_waterfall_element, null, { renderer: 'svg' });


            
            
            

            
            columns_change_waterfall.setOption({

                
                color: ['#f17a52', '#03A9F4'],

                
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
                    right: 10,
                    top: 35,
                    bottom: 0,
                    containLabel: true
                },

                
                legend: {
                    data: ['Expenses', 'Income'],
                    itemHeight: 8,
                    itemGap: 30,
                    textStyle: {
                        color: 'var(--body-color)',
                        padding: [0,5]
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
                    },
                    formatter: function (params) {
                        var tar;
                        if (params[1].value != '-') {
                            tar = params[1];
                        }
                        else {
                            tar = params[0];
                        }
                        return tar.name + '<br/>' + tar.seriesName + ': ' + tar.value;
                    }
                },

                
                xAxis: [{
                    type: 'category',
                    data: ['January','February','March','April','May','June','July','August','September','October','November','December'],
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

                
                series: [
                    {
                        name: 'Aid',
                        type: 'bar',
                        stack: 'Total',
                        itemStyle: {
                            normal: {
                                barBorderColor: 'rgba(0,0,0,0)',
                                color: 'rgba(0,0,0,0)'
                            },
                            emphasis: {
                                barBorderColor: 'rgba(0,0,0,0)',
                                color: 'rgba(0,0,0,0)'
                            }
                        },
                        data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292, 992]
                    },
                    {
                        name: 'Income',
                        type: 'bar',
                        stack: 'Total',
                        itemStyle: {
                            normal: {
                                barBorderRadius: 4,
                                label: {
                                    show: true,
                                    position: 'top',
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color: 'var(--body-color)'
                                }
                            }
                        },
                        data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-']
                    },
                    {
                        name: 'Expenses',
                        type: 'bar',
                        stack: 'Total',
                        itemStyle: {
                            normal: {
                                barBorderRadius: 4,
                                label: {
                                    show: true,
                                    position: 'bottom',
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color: 'var(--body-color)'
                                }
                            }
                        },
                        data: ['-', '-', '-', 108, 154, '-', '-', '-', 119, 361, 203,300]
                    }
                ]
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            columns_change_waterfall_element && columns_change_waterfall.resize();
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
            _waterfallChangeLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsWaterfallChangeLight.init();
});
