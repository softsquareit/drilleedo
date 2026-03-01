





const CardFooter = function() {


    
    
    

    
    const _componentSelect2 = function() {
        if (!$().select2) {
            console.warn('Warning - select2.min.js is not loaded.');
            return;
        }

        
        $('.form-control-select2').select2({
            minimumResultsForSearch: Infinity
        });
    };

    
    const _componentMulti = function() {
        if (!$().multiselect) {
            console.warn('Warning - bootstrap-multiselect.js is not loaded.');
            return;
        }

        
        $('.form-control-multiselect').multiselect();
    };

    
    const _componentNouiSlider = function() {
        if (typeof noUiSlider == 'undefined') {
            console.warn('Warning - nouislider.min.js is not loaded.');
            return;
        }


        
        
        

        
        const slider_connect_lower = document.getElementById('noui-slider-demo');

        
        noUiSlider.create(slider_connect_lower, {
            start: 60,
            connect: 'lower',
            tooltips: true,
            range: {
              'min': 0,
              'max': 100
            }
        });


        
        
        

        
        var noui_slider_demo = document.getElementById('noui-slider-demo2');

        
        noUiSlider.create(noui_slider_demo, {
            start: [ 20, 80 ],
            behaviour: 'drag',
            connect: true,
            tooltips: true,
            range: {
                'min':  0,
                'max':  100
            }
        });
    };


    
    
    

    return {
        init: function() {
            _componentSelect2();
            _componentMulti();
            _componentNouiSlider();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    CardFooter.init();
});
