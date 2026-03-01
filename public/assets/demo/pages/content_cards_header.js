





const CardHeader = function() {


    
    
    

    
    const _componentSelect2 = function() {
        if (!$().select2) {
            console.warn('Warning - select2.min.js is not loaded.');
            return;
        };

        
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

        
        const noui_slider_demo = document.getElementById('noui-slider-demo');

        
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

    
    const _componentDragula = function() {
        if (typeof dragula == 'undefined') {
            console.warn('Warning - dragula.min.js is not loaded.');
            return;
        }

        
        const containers = Array.from(document.querySelectorAll('[class*="col-"], .content'));

        
        dragula(containers, {
            mirrorContainer: document.querySelector('.content-inner'),
            moves: function(el, container, handle) {
                return handle.parentNode.matches('[data-card-action="sort"]');
            }
        });
    };


    
    
    

    return {
        init: function() {
            _componentSelect2();
            _componentMulti();
            _componentNouiSlider();
            _componentDragula();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    CardHeader.init();
});
