





var EchartsCalendarMultipleLight = function() {


    
    
    

    
    var _calendarMultipleLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var calendar_multiple_element = document.getElementById('calendar_multiple');


        
        
        

        if (calendar_multiple_element) {

            
            var calendar_multiple = echarts.init(calendar_multiple_element, null, { renderer: 'svg' });


            
            
            

            
            function getVirtulData(year) {
                year = year || '2017';
                var date = +echarts.number.parseDate(year + '-01-01');
                var end = +echarts.number.parseDate((+year + 1) + '-01-01');
                var dayTime = 3600 * 24 * 1000;
                var data = [];
                for (var time = date; time < end; time += dayTime) {
                    data.push([
                        echarts.format.formatTime('yyyy-MM-dd', time),
                        Math.floor(Math.random() * 10000)
                    ]);
                }
                return data;
            }

            
            calendar_multiple.setOption({

                
                textStyle: {
                    fontFamily: 'var(--body-font-family)',
                    color: 'var(--body-color)',
                    fontSize: 14,
                    lineHeight: 22,
                    textBorderColor: 'transparent'
                },

                
                title: {
                    text: 'Github commits',
                    subtext: 'Open source information',
                    left: 'center',
                    textStyle: {
                        fontSize: 18,
                        fontWeight: 500,
                        color: 'var(--body-color)'
                    },
                    subtextStyle: {
                        fontSize: 12,
                        color: 'rgba(var(--body-color-rgb), 0.5)'
                    }
                },

                
                tooltip: {
                    trigger: 'item',
                    className: 'shadow-sm rounded',
                    backgroundColor: 'var(--white)',
                    borderColor: 'var(--gray-400)',
                    padding: 15,
                    textStyle: {
                        color: '#000'
                    }
                },

                
                legend: {
                    orient: 'vertical',
                    top: 'center',
                    left: 0,
                    data: ['IE', 'Opera', 'Safari', 'Firefox', 'Chrome'],
                    itemHeight: 8,
                    itemWidth: 8,
                    textStyle: {
                        color: 'var(--body-color)'
                    }
                },

                
                visualMap: {
                    min: 0,
                    max: 10000,
                    calculable: true,
                    orient: 'horizontal',
                    left: 'center',
                    text: ['High', 'Low'],
                    textGap: 20,
                    itemHeight: 280,
                    color: ['#4CAF50', '#E8F5E9'],
                    bottom: 0,
                    textStyle: {
                        fontSize: 12,
                        color: 'var(--body-color)'
                    }
                },

                
                calendar: [
                    {
                        range: ['2011-01-01', '2011-12-31'],
                        cellSize: ['auto', 22],
                        top: 80,
                        left: 70,
                        right: 5,
                        itemStyle: {
                            borderColor: 'var(--card-bg)',
                        },
                        splitLine: {
                            lineStyle: {
                                color: 'var(--dark)',
                                width: 3
                            }
                        },
                        dayLabel: {
                            color: 'var(--body-color)'
                        },
                        monthLabel: {
                            color: 'var(--body-color)'
                        },
                        yearLabel: {
                            margin: 50,
                            fontWeight: 500
                        }
                    },
                    {
                        top: 290,
                        range: '2012',
                        cellSize: ['auto', 22],
                        left: 70,
                        right: 5,
                        itemStyle: {
                            borderColor: 'var(--card-bg)',
                        },
                        splitLine: {
                            lineStyle: {
                                color: 'var(--dark)',
                                width: 3
                            }
                        },
                        dayLabel: {
                            color: 'var(--body-color)'
                        },
                        monthLabel: {
                            color: 'var(--body-color)'
                        },
                        yearLabel: {
                            margin: 50,
                            fontWeight: 500
                        }
                    },
                    {
                        top: 500,
                        range: '2013',
                        cellSize: ['auto', 22],
                        left: 70,
                        right: 5,
                        itemStyle: {
                            borderColor: 'var(--card-bg)',
                        },
                        splitLine: {
                            lineStyle: {
                                color: 'var(--dark)',
                                width: 3
                            }
                        },
                        dayLabel: {
                            color: 'var(--body-color)'
                        },
                        monthLabel: {
                            color: 'var(--body-color)'
                        },
                        yearLabel: {
                            margin: 50,
                            fontWeight: 500
                        }
                    }
                ],

                
                series: [{
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    calendarIndex: 0,
                    data: getVirtulData(2011)
                }, {
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    calendarIndex: 1,
                    data: getVirtulData(2012)
                }, {
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    calendarIndex: 2,
                    data: getVirtulData(2013)
                }]
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            calendar_multiple_element && calendar_multiple.resize();
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
            _calendarMultipleLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsCalendarMultipleLight.init();
});
