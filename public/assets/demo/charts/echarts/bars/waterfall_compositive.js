





var EchartsWaterfallCompositiveLight = function() {


    
    
    

    
    var _waterfallCompositiveLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var columns_compositive_waterfall_element = document.getElementById('columns_compositive_waterfall');


        
        
        

        if (columns_compositive_waterfall_element) {

            
            var columns_compositive_waterfall = echarts.init(columns_compositive_waterfall_element, null, { renderer: 'svg' });


            
            
            

            
            columns_compositive_waterfall.setOption({

                
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
                        var tar = params[0];
                        return tar.name + '<br/>' + tar.seriesName + ': ' + tar.value;
                    }
                },

                
                xAxis: [{
                    type: 'category',
                    data: ['Total cost', 'Rent', 'Utilities', 'Transport', 'Meals', 'Commodity', 'Taxes', 'Travel'],
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
                        data:[0, 3500, 3000, 2300, 1700, 900, 400, 0]
                    },
                    {
                        name: 'Cost of living',
                        type: 'bar',
                        stack: 'Total',
                        itemStyle: {
                            normal: {
                                barBorderRadius: 4,
                                color: '#42A5F5',
                                label: {
                                    show: true,
                                    position: 'inside',
                                    fontWeight: 500,
                                    fontSize: 12
                                }
                            },
                            emphasis: {
                                color: '#42A5F5',
                            }
                        },
                        data: [4500, 1000, 500, 700, 600, 800, 500, 400]
                    }
                ]
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            columns_compositive_waterfall_element && columns_compositive_waterfall.resize();
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
            _waterfallCompositiveLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsWaterfallCompositiveLight.init();
});
