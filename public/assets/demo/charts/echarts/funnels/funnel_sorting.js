





var EchartsFunnelSortingLight = function() {


    
    
    

    
    var _funnelSortingLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        
        var funnel_sorting_element = document.getElementById('funnel_sorting');


        
        
        

        if (funnel_sorting_element) {

            
            var funnel_sorting = echarts.init(funnel_sorting_element, null, { renderer: 'svg' });


            
            
            

            
            funnel_sorting.setOption({

                
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
                    text: 'Browser popularity',
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
                    },
                    formatter: '{a} <br/>{b}: {c}%'
                },

                
                legend: {
                    orient: 'vertical',
                    top: 'center',
                    left: 0,
                    data: ['IE','Opera','Safari','Firefox','Chrome'],
                    itemHeight: 8,
                    itemWidth: 8,
                    textStyle: {
                        color: 'var(--body-color)'
                    }
                },

                
                series: [
                    {
                        name: 'Statistics',
                        type: 'funnel',
                        left: '25%',
                        right: '25%',
                        top: '16%',
                        height: '84%',
                        sort: 'ascending',
                        itemStyle: {
                            borderColor: 'var(--card-bg)',
                            label: {
                                position: 'right'
                            }
                        },
                        data: [
                            {value: 60, name: 'Safari'},
                            {value: 40, name: 'Firefox'},
                            {value: 20, name: 'Chrome'},
                            {value: 80, name: 'Opera'},
                            {value: 100, name: 'IE'}
                        ]
                    }
                ]
            });
        }


        
        
        

        
        var triggerChartResize = function() {
            funnel_sorting_element && funnel_sorting.resize();
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
            _funnelSortingLightExample();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    EchartsFunnelSortingLight.init();
});
