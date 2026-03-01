





var EchartsPieInfographicedLight = function() {


    
    
    

    
    var _scatterPieInfographicLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var pie_infographic_element = document.getElementById('pie_infographic');


        
        
        

        if (pie_infographic_element) {

            
            var pie_infographic = echarts.init(pie_infographic_element, null, { renderer: 'svg' });


            
            
            

            
            var dataStyle = {
                normal: {
                    borderWidth: 1,
                    borderColor: 'var(--card-bg)',
                    label: {
                        show: false
                    },
                }
            };

            var placeHolderStyle = {
                normal: {
                    color: 'transparent',
                    borderWidth: 0
                }
            };

            
            pie_infographic.setOption({

                
                color: [
                    '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
                    '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
                    '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
                    '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
                ],

                
                textStyle: {
                    fontFamily: 'var(--body-font-family)',
                    color: 'var(--body-color)',
                    fontSize: 14,
                    lineHeight: 22,
                    textBorderColor: 'transparent'
                },

                
                title: {
                    text: 'Are you happy?',
                    subtext: 'Utrecht, Netherlands',
                    left: 'center',
                    top: '45%',
                    textStyle: {
                        fontSize: 18,
                        fontWeight: 500,
                        color: 'var(--link-color)'
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
                    },
                    formatter: function (params) {
                        if(params.color == "transparent")return;
                        return params.percent + '%' + ' - ' + params.seriesName;
                    }
                },

                
                legend: {
                    orient: 'vertical',
                    top: '5%',
                    left: (pie_infographic_element.offsetWidth / 2) + 20,
                    data: ['60% Definitely yes','30% Could be better','10% Not at the moment'],
                    itemHeight: 8,
                    itemWidth: 8,
                    itemGap: 7,
                    textStyle: {
                        color: 'var(--body-color)'
                    },
                    itemStyle: {
                        borderColor: 'transparent'
                    }
                },

                
                series: [
                    {
                        name: 'Definitely yes',
                        type: 'pie',
                        cursor: 'default',
                        clockWise: false,
                        radius: ['75%', '90%'],
                        hoverOffset: 0,
                        itemStyle: dataStyle,
                        data: [
                            {
                                value: 60,
                                name: '60% Definitely yes'
                            },
                            {
                                value: 40,
                                name: '',
                                itemStyle: placeHolderStyle
                            }
                        ]
                    },

                    {
                        name: 'Could be better',
                        type:'pie',
                        cursor: 'default',
                        clockWise: false,
                        radius: ['60%', '75%'],
                        hoverOffset: 0,
                        itemStyle: dataStyle,
                        data: [
                            {
                                value: 30, 
                                name: '30% Could be better'
                            },
                            {
                                value: 70,
                                name: 'invisible',
                                silent: false,
                                itemStyle: placeHolderStyle
                            }
                        ]
                    },

                    {
                        name: 'Not at the moment',
                        type: 'pie',
                        cursor: 'default',
                        clockWise: false,
                        radius: ['45%', '60%'],
                        hoverOffset: 0,
                        itemStyle: dataStyle,
                        data: [
                            {
                                value: 10, 
                                name: '10% Not at the moment'
                            },
                            {
                                value: 90,
                                name: 'invisible',
                                itemStyle: placeHolderStyle
                            }
                        ]
                    }
                ]
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            pie_infographic_element && pie_infographic.resize();
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
            _scatterPieInfographicLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsPieInfographicedLight.init();
});
