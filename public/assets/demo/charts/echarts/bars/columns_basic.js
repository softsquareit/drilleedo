





var EchartsColumnsBasicLight = function() {


    
    
    

    
    var _columnsBasicLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var columns_basic_element = document.getElementById('columns_basic');


        
        
        

        if (columns_basic_element) {

            
            var columns_basic = echarts.init(columns_basic_element, null, { renderer: 'svg' });


            
            
            

            
            columns_basic.setOption({

                
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
                    left: 0,
                    right: 45,
                    top: 35,
                    bottom: 0,
                    containLabel: true
                },

                
                legend: {
                    data: ['Evaporation', 'Precipitation'],
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
                    type: 'category',
                    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
                        name: 'Evaporation',
                        type: 'bar',
                        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                        itemStyle: {
                            normal: {
                                barBorderRadius: [4, 4, 0, 0],
                                label: {
                                    show: true,
                                    position: 'top',
                                    fontWeight: 500,
                                    fontSize: 12,
                                    color: 'var(--body-color)'
                                }
                            }
                        },
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
                        name: 'Precipitation',
                        type: 'bar',
                        data: [2.6, 5.9, 9.0, 26.4, 58.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                        itemStyle: {
                            normal: {
                                barBorderRadius: [4, 4, 0, 0],
                                label: {
                                    show: true,
                                    position: 'top',
                                    fontWeight: 500,
                                    fontSize: 12,
                                    color: 'var(--body-color)'
                                }
                            }
                        },
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
            columns_basic_element && columns_basic.resize();
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
            _columnsBasicLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsColumnsBasicLight.init();
});
