





const IonSlider = function() {


    
    
    

    
    const _componentIonSlider = function() {
        if (!$().ionRangeSlider) {
            console.warn('Warning - ion_rangeslider.min.js is not loaded.');
            return;
        }


        
        
        

        
        $('#ion-basic').ionRangeSlider();

        
        $('#ion-start').ionRangeSlider({
            min: 100,
            max: 1000,
            from: 550
        });

        
        $('#ion-range').ionRangeSlider({
            type: 'double',
            min: 0,
            max: 1000,
            from: 200,
            to: 800
        });

        
        $('#ion-negative').ionRangeSlider({
            type: 'double',
            grid: true,
            min: -1000,
            max: 1000,
            from: -500,
            to: 500
        });

        
        $('#ion-step').ionRangeSlider({
            type: 'double',
            grid: true,
            min: -1000,
            max: 1000,
            from: -500,
            to: 500,
            step: 250
        });

        
        $('#ion-fractional').ionRangeSlider({
            type: 'double',
            grid: true,
            min: -12.8,
            max: 12.8,
            from: -3.2,
            to: 3.2,
            step: 0.1
        });


        
        
        

        
        $('#ion-custom-numbers').ionRangeSlider({
            type: 'double',
            grid: true,
            from: 2,
            to: 5,
            values: [0, 5, 10, 20, 35, 50, 70, 100]
        });

        
        $('#ion-custom-strings').ionRangeSlider({
            grid: true,
            from: 5,
            values: [
                'zero', 'one',
                'two', 'three',
                'four', 'five',
                'six', 'seven',
                'eight', 'nine',
                'ten'
            ]
        });

        
        $('#ion-custom-months').ionRangeSlider({
            grid: true,
            from: 3,
            values: [
                'Jan', 'Feb', 'Mar',
                'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'
            ]
        });

        
        $('#ion-numbers-no-prettify').ionRangeSlider({
            grid: true,
            min: 1000,
            max: 10000,
            from: 3000,
            step: 100,
            prettify_enabled: false
        });

        
        $('#ion-numbers-prettify').ionRangeSlider({
            grid: true,
            min: 1000,
            max: 10000,
            from: 3000,
            step: 100,
            prettify_enabled: true
        });

        
        $('#ion-custom-separator').ionRangeSlider({
            grid: true,
            min: 1000,
            max: 10000,
            from: 3000,
            step: 100,
            prettify_enabled: true,
            prettify_separator: ','
        });


        
        
        

        
        $('#ion-custom-prefix').ionRangeSlider({
            type: 'double',
            grid: true,
            min: 0,
            max: 1000,
            from: 250,
            to: 750,
            step: 50,
            prefix: '$'
        });

        
        $('#ion-custom-postfix').ionRangeSlider({
            type: 'double',
            grid: true,
            min: 0,
            max: 1000,
            from: 250,
            to: 750,
            step: 50,
            postfix: '&deg;'
        });

        
        $('#ion-max-no-limit').ionRangeSlider({
            grid: true,
            min: 18,
            max: 70,
            from: 40,
            prefix: 'Age ',
            max_postfix: '+'
        });


        
        $('#ion-decorate-both').ionRangeSlider({
            grid: true,
            type: 'double',
            min: 100,
            max: 200,
            from: 145,
            to: 155,
            prefix: 'HDD: ',
            postfix: ' Gb',
            decorate_both: true
        });

        
        $('#ion-decorate-both-custom').ionRangeSlider({
            grid: true,
            type: 'double',
            min: 100,
            max: 200,
            from: 145,
            to: 155,
            prefix: 'HDD: ',
            postfix: ' Gb',
            values_separator: ' → '
        });

        
        $('#ion-decorate-both-remove').ionRangeSlider({
            grid: true,
            type: 'double',
            min: 100,
            max: 200,
            from: 145,
            to: 155,
            prefix: 'HDD: ',
            postfix: ' Gb',
            decorate_both: false
        });


        
        
        

        
        $('#ion-force-edges').ionRangeSlider({
            type: 'double',
            min: 1000000,
            max: 2000000,
            grid: true,
            force_edges: true
        });

        
        $('#ion-disabled').ionRangeSlider({
            grid: true,
            min: 0,
            max: 100,
            from: 30,
            disable: true
        });

        
        $('#ion-keyboard').ionRangeSlider({
            grid: true,
            type: 'double',
            min: 0,
            max: 100,
            from: 30,
            to: 70,
            keyboard: true
        });

        
        $('#ion-grid-values').ionRangeSlider({
            type: 'double',
            min: 0,
            max: 100,
            from: 30,
            to: 70,
            grid: true,
            grid_num: 20
        });

        
        $('#ion-grid-snap').ionRangeSlider({
            type: 'double',
            min: 0,
            max: 1000,
            step: 100,
            grid: true,
            grid_snap: true
        });

        
        $('#ion-grid-snap-fractional').ionRangeSlider({
            type: 'single',
            min: 0,
            max: 10,
            from: 4.68,
            step: 2.34,
            grid: true,
            grid_snap: true
        });


        
        
        

        
        $('#ion-interval-min').ionRangeSlider({
            grid: true,
            type: 'double',
            min: 0,
            max: 100,
            from: 30,
            to: 70,
            min_interval: 20
        });

        
        $('#ion-interval-max').ionRangeSlider({
            grid: true,
            type: 'double',
            min: 0,
            max: 100,
            from: 30,
            to: 70,
            max_interval: 50
        });

        
        $('#ion-interval-drag').ionRangeSlider({
            grid: true,
            type: 'double',
            min: 0,
            max: 100,
            from: 30,
            to: 70,
            drag_interval: true
        });


        
        $('#ion-lock-from').ionRangeSlider({
            grid: true,
            type: 'double',
            min: 0,
            max: 1000,
            from: 250,
            to: 750,
            from_fixed: true
        });

        
        $('#ion-lock-to').ionRangeSlider({
            grid: true,
            type: 'double',
            min: 0,
            max: 1000,
            from: 250,
            to: 750,
            to_fixed: true
        });

        
        $('#ion-lock-both').ionRangeSlider({
            grid: true,
            type: 'double',
            min: 0,
            max: 1000,
            from: 250,
            to: 750,
            from_fixed: true,
            to_fixed: true
        });


        
        
        

        
        $('#ion-movement-limit').ionRangeSlider({
            grid: true,
            min: 0,
            max: 1000,
            from: 500,
            from_min: 100,
            from_max: 750
        });

        
        $('#ion-highlight-limit').ionRangeSlider({
            grid: true,
            min: 0,
            max: 1000,
            from: 500,
            from_min: 100,
            from_max: 750,
            from_shadow: true
        });

        
        $('#ion-highlight-range').ionRangeSlider({
            type: 'double',
            min: 0,
            max: 100,
            from: 20,
            from_min: 10,
            from_max: 30,
            from_shadow: true,
            to: 80,
            to_min: 70,
            to_max: 90,
            to_shadow: true,
            grid: true,
            grid_num: 10
        });


        
        $('#ion-moment-basic').ionRangeSlider({
            grid: true,
            min: +moment().subtract(1, 'years').format('X'),
            max: +moment().format('X'),
            from: +moment().subtract(6, 'months').format('X'),
            force_edges: true,
            prettify: function (num) {
                return moment(num, 'X').format('ll');
            }
        });

        
        $('#ion-moment-time').ionRangeSlider({
            grid: true,
            min: +moment().subtract(12, 'hours').format('X'),
            max: +moment().format('X'),
            from: +moment().subtract(6, 'hours').format('X'),
            force_edges: true,
            prettify: function (num) {
                return moment(num, 'X').format('hh:mm A');
            }
        });

        
        $('#ion-moment-local').ionRangeSlider({
            grid: true,
            min: +moment().subtract(11, 'months').format('X'),
            max: +moment().format('X'),
            from: +moment().subtract(6, 'months').format('X'),
            force_edges: true,
            prettify: function (num) {
                var m = moment(num, 'X').locale('ru');
                return m.format('MMMM');
            }
        });
    };


    
    
    

    return {
        init: function() {
            _componentIonSlider();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    IonSlider.init();
});
