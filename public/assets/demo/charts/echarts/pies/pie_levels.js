





var EchartsPieLevelsLight = function() {


    
    
    

    
    var _pieLevelsLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var pie_levels_element = document.getElementById('pie_levels');


        
        
        

        if (pie_levels_element) {

            
            var pie_levels = echarts.init(pie_levels_element, null, { renderer: 'svg' });


            
            
            

            
            pie_levels.setOption({

                
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
                    text: 'Browser statistics',
                    subtext: 'Based on shared research',
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
                    },
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },

                
                legend: {
                    orient: 'vertical',
                    top: 'center',
                    left: 0,
                    data: ['Chrome','Firefox','Safari','IE9+','IE8-'],
                    itemHeight: 8,
                    itemWidth: 8,
                    textStyle: {
                        color: 'var(--body-color)'
                    },
                    itemStyle: {
                        borderColor: 'transparent'
                    }
                },

                
                series: (function () {
                    var series = [];
                    for (var i = 0; i < 30; i++) {
                        series.push({
                            name: 'Browser',
                            type: 'pie',
                            hoverOffset: 0,
                            itemStyle: {
                                borderColor: 'var(--card-bg)'
                            },
                            label: {
                                show: i > 28,
                                color: 'var(--body-color)'
                            },
                            labelLine: {
                                show: i > 28,
                                length: 20
                            },
                            radius: [i * 3.6 + 40, i * 3.6 + 43],
                            center: ['50%', '55%'],
                            data: [
                                {value: i * 128 + 80,  name: 'Chrome'},
                                {value: i * 64  + 160,  name: 'Firefox'},
                                {value: i * 32  + 320,  name: 'Safari'},
                                {value: i * 16  + 640,  name: 'IE9+'},
                                {value: i * 8  + 1280, name: 'IE8-'}
                            ]
                        })
                    }
                    return series;
                })()
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            pie_levels_element && pie_levels.resize();
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
            _pieLevelsLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsPieLevelsLight.init();
});
