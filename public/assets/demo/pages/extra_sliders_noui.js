





const NouiSlider = function() {


    
    
    

    
    const _componentNouiSlider = function() {
        if (typeof noUiSlider == 'undefined') {
            console.warn('Warning - nouislider.min.js is not loaded.');
            return;
        }


        
        

        
        const slider_handles = document.getElementById('noui-slider-handles');
        noUiSlider.create(slider_handles, {
            start: [40, 80],
            range: {
                'min': [20],
                'max': [100]
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_handles_vals = [
            document.getElementById('noui-handles-lower-val'),
            document.getElementById('noui-handles-upper-val')
        ];
        slider_handles.noUiSlider.on('update', function( values, handle ) {
            slider_handles_vals[handle].innerHTML = values[handle];
        });


        
        

        
        const slider_range = document.getElementById('noui-slider-range');
        noUiSlider.create(slider_range, {
            start: [60],
            range: {
                'min': [20],
                'max': [100]
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_range_val = document.getElementById('noui-range-val');
        slider_range.noUiSlider.on('update', function( values, handle ) {
            slider_range_val.innerHTML = values[handle];
        });


        
        

        
        const slider_stepping = document.getElementById('noui-slider-stepping');
        noUiSlider.create(slider_stepping, {
            start: [40],
            step: 10,
            range: {
                'min': [20],
                'max': [100]
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_stepping_val = document.getElementById('noui-stepping-val');
        slider_stepping.noUiSlider.on('update', function( values, handle ) {
            slider_stepping_val.innerHTML = values[handle];
        });


        
        

        
        const slider_nonlinear = document.getElementById('noui-slider-nonlinear');

        
        noUiSlider.create(slider_nonlinear, {
            start: [ 40 ],
            range: {
                'min': [  20 ],
                '30%': [  40 ],
                '70%': [  80 ],
                'max': [ 100 ]
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_nonlinear_val = document.getElementById('noui-nonlinear-val');

        
        slider_nonlinear.noUiSlider.on('update', function( values, handle ) {
            slider_nonlinear_val.innerHTML = values[handle];
        });


        
        

        
        const slider_nonlinear_step = document.getElementById('noui-slider-nonlinear-stepping');

        
        noUiSlider.create(slider_nonlinear_step, {
            start: [ 5, 40 ],
            range: {
                'min': [     0 ],
                '10%': [   5,  5 ],
                '50%': [  40, 10 ],
                'max': [ 100 ]
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_nonlinear_step_vals = [
            document.getElementById('noui-nonlinear-stepping-lower-val'),
            document.getElementById('noui-nonlinear-stepping-upper-val')
        ];

        
        slider_nonlinear_step.noUiSlider.on('update', function( values, handle ) {
            slider_nonlinear_step_vals[handle].innerHTML = values[handle];
        });


        
        

        
        const slider_nonlinear_snap = document.getElementById('noui-slider-snapping');

        
        noUiSlider.create(slider_nonlinear_snap, {
            start: [50, 800],
            snap: true,
            connect: true,
            range: {
                'min': 0,
                '10%': 50,
                '20%': 100,
                '30%': 150,
                '40%': 500,
                '50%': 800,
                'max': 1000
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_nonlinear_snap_vals = [
            document.getElementById('noui-slider-snapping-lower-val'),
            document.getElementById('noui-slider-snapping-upper-val')
        ];

        
        slider_nonlinear_snap.noUiSlider.on('update', function( values, handle ) {
            slider_nonlinear_snap_vals[handle].innerHTML = values[handle];
        });



        
        

        
        
        

        
        slider_behaviour = document.getElementById('noui-slider-behaviour');

        
        noUiSlider.create(slider_behaviour, {
            start: [ 40, 60 ],
            step: 10,
            behaviour: 'drag',
            connect: true,
            range: {
                'min':  20,
                'max':  80
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_behaviour_vals = [
            document.getElementById('noui-slider-behaviour-lower-val'),
            document.getElementById('noui-slider-behaviour-upper-val')
        ];

        
        slider_behaviour.noUiSlider.on('update', function( values, handle ) {
            slider_behaviour_vals[handle].innerHTML = values[handle];
        });


        
        
        

        
        slider_tap_behaviour = document.getElementById('noui-slider-tap');

        
        noUiSlider.create(slider_tap_behaviour, {
            start: 40,
            behaviour: 'tap',
            connect: 'upper',
            range: {
                'min':  20,
                'max':  80
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_tap_behaviour_val = document.getElementById('noui-slider-tap-val');

        
        slider_tap_behaviour.noUiSlider.on('update', function( values, handle ) {
            slider_tap_behaviour_val.innerHTML = values[handle];
        });


        
        
        

        
        const slider_drag_behaviour = document.getElementById('noui-slider-drag');

        
        noUiSlider.create(slider_drag_behaviour, {
            start: [ 40, 60 ],
            behaviour: 'drag',
            connect: true,
            range: {
                'min':  20,
                'max':  80
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_drag_behaviour_vals = [
            document.getElementById('noui-slider-drag-lower-val'),
            document.getElementById('noui-slider-drag-upper-val')
        ];

        
        slider_drag_behaviour.noUiSlider.on('update', function( values, handle ) {
            slider_drag_behaviour_vals[handle].innerHTML = values[handle];
        });


        
        
        

        
        slider_drag_fixed = document.getElementById('noui-slider-drag-fixed');

        
        noUiSlider.create(slider_drag_fixed, {
            start: [ 40, 60 ],
            behaviour: 'drag-fixed',
            connect: true,
            range: {
                'min':  20,
                'max':  80
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_drag_fixed_vals = [
            document.getElementById('noui-slider-fixed-lower-val'),
            document.getElementById('noui-slider-fixed-upper-val')
        ];

        
        slider_drag_fixed.noUiSlider.on('update', function( values, handle ) {
            slider_drag_fixed_vals[handle].innerHTML = values[handle];
        });


        
        
        

        
        slider_snap_behaviour = document.getElementById('noui-slider-snap');

        
        noUiSlider.create(slider_snap_behaviour, {
            start: 40,
            behaviour: 'snap',
            connect: 'lower',
            range: {
                'min':  20,
                'max':  80
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_snap_behaviour_val = document.getElementById('noui-slider-snap-val');

        
        slider_snap_behaviour.noUiSlider.on('update', function( values, handle ) {
            slider_snap_behaviour_val.innerHTML = values[handle];
        });


        
        
        

        
        slider_combined = document.getElementById('noui-slider-combined');

        
        noUiSlider.create(slider_combined, {
            start: [ 40, 60 ],
            behaviour: 'drag-tap',
            connect: true,
            range: {
                'min':  20,
                'max':  80
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_combined_vals = [
            document.getElementById('noui-slider-combined-lower-val'),
            document.getElementById('noui-slider-combined-upper-val')
        ];

        
        slider_combined.noUiSlider.on('update', function( values, handle ) {
            slider_combined_vals[handle].innerHTML = values[handle];
        });



        
        

        
        
        

        
        const slider_tooltip = document.getElementById('noui-slider-tooltip');

        
        noUiSlider.create(slider_tooltip, {
            start: [20, 80],
            tooltips: true,
            connect: true,
            range: {
                'min': 0,
                'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_tooltip_vals = [
            document.getElementById('noui-slider-tooltip-lower-val'),
            document.getElementById('noui-slider-tooltip-upper-val')
        ];

        
        slider_tooltip.noUiSlider.on('update', function( values, handle ) {
            slider_tooltip_vals[handle].innerHTML = values[handle];
        });


        
        
        

        
        const slider_margin = document.getElementById('noui-slider-margin');

        
        noUiSlider.create(slider_margin, {
            start: [ 20, 80 ],
            connect: true,
            margin: 30,
            range: {
                'min': 0,
                'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_margin_vals = [
            document.getElementById('noui-slider-margin-lower-val'),
            document.getElementById('noui-slider-margin-upper-val')
        ];

        
        slider_margin.noUiSlider.on('update', function( values, handle ) {
            slider_margin_vals[handle].innerHTML = values[handle];
        });


        
        
        

        
        const slider_direction = document.getElementById('noui-slider-direction');

        
        noUiSlider.create(slider_direction, {
            start: 20,
            direction: 'rtl',
            connect: 'lower',
            range: {
                'min': 0,
                'max': 100
            }
        });

        
        const slider_direction_val = document.getElementById('noui-slider-direction-val');

        
        slider_direction.noUiSlider.on('update', function( values, handle ) {
            slider_direction_val.innerHTML = values[handle];
        });


        
        
        

        
        const slider_connect_lower = document.getElementById('noui-slider-connect-lower');

        
        noUiSlider.create(slider_connect_lower, {
            start: 40,
            connect: 'lower',
            range: {
              'min': 0,
              'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_connect_lower_val = document.getElementById('noui-slider-connect-lower-val');

        
        slider_connect_lower.noUiSlider.on('update', function( values, handle ) {
            slider_connect_lower_val.innerHTML = values[handle];
        });


        
        
        

        
        const slider_skip = document.getElementById('noui-slider-skip-steps');

        
        noUiSlider.create(slider_skip, {
            range: {
                'min': 0,
                '10%': 10,
                '20%': 20,
                '30%': 30,
                
                '50%': 50,
                '60%': 60,
                '70%': 70,
                
                '90%': 90,
                'max': 100
            },
            snap: true,
            connect: true,
            start: [20, 70],
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_skip_vals = [
            document.getElementById('noui-slider-skip-lower-val'),
            document.getElementById('noui-slider-skip-upper-val')
        ];

        
        slider_skip.noUiSlider.on('update', function( values, handle ) {
            slider_skip_vals[handle].innerHTML = values[handle];
        });


        
        
        

        
        const slider_connect_upper = document.getElementById('noui-slider-connect-upper');

        
        noUiSlider.create(slider_connect_upper, {
            start: 40,
            connect: 'upper',
            range: {
              'min': 0,
              'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_connect_upper_val = document.getElementById('noui-slider-connect-upper-val');

        
        slider_connect_upper.noUiSlider.on('update', function( values, handle ) {
            slider_connect_upper_val.innerHTML = values[handle];
        });


        
        

        
        const range_all_sliders = {
            'min': [     0 ],
            '10%': [   5,  5 ],
            '50%': [  40, 10 ],
            'max': [ 100 ]
        };


        
        
        

        
        const pips_range = document.getElementById('noui-slider-pips-range');

        
        noUiSlider.create(pips_range, {
            range: range_all_sliders,
            start: 40,
            connect: 'lower',
            pips: {
                mode: 'range',
                density: 3
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });


        
        
        

        
        function filter500(value, type) {
            if (type === 0) {
                return value = 0 ? -1 : 0;
            }
            return value % 10 ? 2 : 1;
        }

        
        const pips_filter = document.getElementById('noui-slider-pips-filter');

        
        noUiSlider.create(pips_filter, {
            range: range_all_sliders,
            start: 40,
            connect: 'lower',
            pips: {
                mode: 'steps',
                density: 2,
                filter: filter500
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });


        
        
        

        
        pips_rtl = document.getElementById('noui-slider-pips-rtl');

        
        noUiSlider.create(pips_rtl, {
            range: range_all_sliders,
            start: 60,
            connect: 'lower',
            direction: 'rtl',
            pips: {
                mode: 'range',
                density: 3
            }
        });


        
        
        

        
        const pips_positions = document.getElementById('noui-slider-pips-positions');

        
        noUiSlider.create(pips_positions, {
            range: range_all_sliders,
            start: 18,
            connect: 'upper',
            pips: {
                mode: 'positions',
                values: [0,25,50,75,100],
                density: 4
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });


        
        
        

        
        const pips_count = document.getElementById('noui-slider-pips-count');

        
        noUiSlider.create(pips_count, {
            range: range_all_sliders,
            start: 20,
            connect: 'upper',
            pips: {
                mode: 'count',
                values: 6,
                density: 4
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });


        
        
        

        
        const pips_values = document.getElementById('noui-slider-pips-values');

        
        noUiSlider.create(pips_values, {
            range: range_all_sliders,
            start: 40,
            connect: 'upper',
            pips: {
                mode: 'values',
                values: [1, 10, 26, 57, 79, 99],
                density: 4
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });



        
        

        
        
        

        
        const slider_vertical_1 = document.getElementById('noui-slider-values1');
        noUiSlider.create(slider_vertical_1, {
            start: 20,
            orientation: 'vertical',
            range: {
                'min': 0,
                'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_vertical_2 = document.getElementById('noui-slider-values2');
        noUiSlider.create(slider_vertical_2, {
            start: 40,
            orientation: 'vertical',
            range: {
                'min': 0,
                'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_vertical_3 = document.getElementById('noui-slider-values3');
        noUiSlider.create(slider_vertical_3, {
            start: 60,
            orientation: 'vertical',
            range: {
                'min': 0,
                'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_vertical_4 = document.getElementById('noui-slider-values4');
        noUiSlider.create(slider_vertical_4, {
            start: 80,
            orientation: 'vertical',
            range: {
                'min': 0,
                'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });


        
        
        

        
        const slider_vertical_upper_1 = document.getElementById('noui-slider-upper1');
        noUiSlider.create(slider_vertical_upper_1, {
            start: 20,
            orientation: 'vertical',
            connect: 'upper',
            range: {
                'min': 0,
                'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_vertical_upper_2 = document.getElementById('noui-slider-upper2');
        noUiSlider.create(slider_vertical_upper_2, {
            start: 40,
            orientation: 'vertical',
            connect: 'upper',
            range: {
                'min': 0,
                'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_vertical_upper_3 = document.getElementById('noui-slider-upper3');
        noUiSlider.create(slider_vertical_upper_3, {
            start: 60,
            orientation: 'vertical',
            connect: 'upper',
            range: {
                'min': 0,
                'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_vertical_upper_4 = document.getElementById('noui-slider-upper4');
        noUiSlider.create(slider_vertical_upper_4, {
            start: 80,
            orientation: 'vertical',
            connect: 'upper',
            range: {
                'min': 0,
                'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });


        
        
        

        
        const slider_vertical_lower_1 = document.getElementById('noui-slider-lower1');
        noUiSlider.create(slider_vertical_lower_1, {
            start: 20,
            orientation: 'vertical',
            connect: 'lower',
            range: {
                'min': 0,
                'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_vertical_lower_2 = document.getElementById('noui-slider-lower2');
        noUiSlider.create(slider_vertical_lower_2, {
            start: 40,
            orientation: 'vertical',
            connect: 'lower',
            range: {
                'min': 0,
                'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_vertical_lower_3 = document.getElementById('noui-slider-lower3');
        noUiSlider.create(slider_vertical_lower_3, {
            start: 60,
            orientation: 'vertical',
            connect: 'lower',
            range: {
                'min': 0,
                'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_vertical_lower_4 = document.getElementById('noui-slider-lower4');
        noUiSlider.create(slider_vertical_lower_4, {
            start: 80,
            orientation: 'vertical',
            connect: 'lower',
            range: {
                'min': 0,
                'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });


        
        
        

        
        const slider_range_1 = document.getElementById('noui-slider-range1');
        noUiSlider.create(slider_range_1, {
            start: [ 15, 85 ],
            orientation: 'vertical',
            connect: true,
            range: {
                'min': 0,
                'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_range_2 = document.getElementById('noui-slider-range2');
        noUiSlider.create(slider_range_2, {
            start: [ 30, 70 ],
            orientation: 'vertical',
            connect: true,
            range: {
                'min': 0,
                'max': 100
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });


        
        
        

        
        const slider_pips_top_1 = document.getElementById('noui-slider-top1');
        noUiSlider.create(slider_pips_top_1, {
            range: range_all_sliders,
            start: 40,
            connect: 'lower',
            orientation: 'vertical',
            pips: {
                mode: 'range',
                density: 5
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        const slider_pips_top_2 = document.getElementById('noui-slider-top2');
        noUiSlider.create(slider_pips_top_2, {
            range: range_all_sliders,
            start: 60,
            connect: 'lower',
            orientation: 'vertical',
            pips: {
                mode: 'range',
                density: 5
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });


        
        
        

        
        const slider_pips_bottom_1 = document.getElementById('noui-slider-bottom1');
        noUiSlider.create(slider_pips_bottom_1, {
            range: range_all_sliders,
            start: 40,
            connect: 'lower',
            orientation: 'vertical',
            direction: 'rtl',
            pips: {
                mode: 'range',
                density: 5
            }
        });

        
        const slider_pips_bottom_2 = document.getElementById('noui-slider-bottom2');
        noUiSlider.create(slider_pips_bottom_2, {
            range: range_all_sliders,
            start: 60,
            connect: 'lower',
            orientation: 'vertical',
            direction: 'rtl',
            pips: {
                mode: 'range',
                density: 5
            }
        });



        
        

        
        
        

        
        const color1 = document.getElementById('noui-slider-color-demo1'),
            color2 = document.getElementById('noui-slider-color-demo2'),
            color3 = document.getElementById('noui-slider-color-demo3'),
            color4 = document.getElementById('noui-slider-color-demo4'),
            color5 = document.getElementById('noui-slider-color-demo5'),
            color6 = document.getElementById('noui-slider-color-demo6');

        
        const color_options = {
            start: [2, 8],
            connect: true,
            range: {
                'min': 0,
                'max': 10
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        }

        
        noUiSlider.create(color1, color_options);
        noUiSlider.create(color2, color_options);
        noUiSlider.create(color3, color_options);
        noUiSlider.create(color4, color_options);
        noUiSlider.create(color5, color_options);
        noUiSlider.create(color6, color_options);


        
        
        

        
        const default_size1 = document.getElementById('slider-default-lg'),
            default_size2 = document.getElementById('slider-default-md'),
            default_size3 = document.getElementById('slider-default-sm'),

            solid_size1 = document.getElementById('slider-solid-lg'),
            solid_size2 = document.getElementById('slider-solid-md'),
            solid_size3 = document.getElementById('slider-solid-sm'),

            white_size1 = document.getElementById('slider-white-lg'),
            white_size2 = document.getElementById('slider-white-md'),
            white_size3 = document.getElementById('slider-white-sm');

        
        noUiSlider.create(default_size1, color_options);
        noUiSlider.create(default_size2, color_options);
        noUiSlider.create(default_size3, color_options);

        noUiSlider.create(solid_size1, color_options);
        noUiSlider.create(solid_size2, color_options);
        noUiSlider.create(solid_size3, color_options);

        noUiSlider.create(white_size1, color_options);
        noUiSlider.create(white_size2, color_options);
        noUiSlider.create(white_size3, color_options);
    };


    
    
    

    return {
        init: function() {
            _componentNouiSlider();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    NouiSlider.init();
});
