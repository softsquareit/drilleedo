





const SidebarComponents = function () {


    
    
    

    
    const _componentSelect2 = function() {
        if (!$().select2) {
            console.warn('Warning - select2.min.js is not loaded.');
            return;
        }

        
        $('.form-control-select2').select2({
            minimumResultsForSearch: Infinity
        });
    };

    
    const _componentMultiselect = function() {
        if (!$().multiselect) {
            console.warn('Warning - bootstrap-multiselect.js is not loaded.');
            return;
        }

        
        $('.form-control-multiselect').multiselect();
    };

    
    const _componentColorPicker = function() {
        if (!$().spectrum) {
            console.warn('Warning - spectrum.js is not loaded.');
            return;
        }

        
        $('.colorpicker-flat-full').spectrum({
            flat: true,
            showInitial: true,
            showButtons: false,
            showInput: true,
            showAlpha: true,
            allowEmpty: true
        });
    };

    
    const _componentDatepicker = function() {
        if (typeof Datepicker == 'undefined') {
            console.warn('Warning - datepicker.min.js is not loaded.');
            return;
        }

        
        const dpBasicElement = document.querySelector('.datepicker-basic');
        if(dpBasicElement) {
            const dpBasic = new Datepicker(dpBasicElement, {
                buttonClass: 'btn',
                orientation: 'bottom left',
                prevArrow: document.dir == 'rtl' ? '&rarr;' : '&larr;',
                nextArrow: document.dir == 'rtl' ? '&larr;' : '&rarr;'
            });
        }
    };

    
    const _componentDragula = function() {
        if (typeof dragula == 'undefined') {
            console.warn('Warning - dragula.min.js is not loaded.');
            return;
        }

        
        const containers = Array.from(document.querySelectorAll('.tab-pane'));

        
        dragula(containers, {
            mirrorContainer: document.querySelector('.tab-pane'),
            moves: function (el, container, handle) {
                return handle.matches('[data-section-action="sort"]');
            }
        });
    };

    
    const _componentReload = function() {

        
        const buttonClass = '[data-section-action=reload]',
              containerClass = 'sidebar-section',
              overlayClass = 'card-overlay',
              spinnerClass = 'ph-circle-notch',
              overlayAnimationClass = 'card-overlay-fadeout';

        
        document.querySelectorAll(buttonClass).forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();

                
                const parentContainer = button.closest(`.${containerClass}`),
                      overlayElement = document.createElement('div'),
                      overlayElementIcon = document.createElement('i');

                
                overlayElement.classList.add(overlayClass);
                parentContainer.appendChild(overlayElement);
                overlayElementIcon.classList.add(spinnerClass, 'spinner', 'text-body');
                overlayElement.appendChild(overlayElementIcon);

                
                setTimeout(function() {
                    overlayElement.classList.add(overlayAnimationClass);
                    ['animationend', 'animationcancel'].forEach(function(e) {
                        overlayElement.addEventListener(e, function() {
                            overlayElement.remove();
                        });
                    });
                }, 2500);
            });
        });
    };

    
    const _componentDualListbox = function() {
        if (typeof DualListbox == 'undefined') {
            console.warn('Warning - dual_listbox.min.js is not loaded.');
            return;
        }

        
        const listboxBasicElement = document.querySelector(".listbox-basic");
        const listboxBasic = new DualListbox(listboxBasicElement);
    };

    
    const _componentFancytree = function() {
        if (!$().fancytree) {
            console.warn('Warning - fancytree_all.min.js is not loaded.');
            return;
        }

        
        $('.tree-default').fancytree();
    };

    
    const _componentLightbox = function() {
        if (typeof GLightbox == 'undefined') {
            console.warn('Warning - glightbox.min.js is not loaded.');
            return;
        }

        
        const lightbox = GLightbox({
            selector: '[data-bs-popup="lightbox"]',
            loop: true,
            svg: {
                next: document.dir == "rtl" ? '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g></svg>' : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"> <g><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/></g></svg>',
                prev: document.dir == "rtl" ? '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/></g></svg>' : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g></svg>'
            }
        });
    };

    
    const _componentNouiSlider = function() {
        if (typeof noUiSlider == 'undefined') {
            console.warn('Warning - nouislider.min.js is not loaded.');
            return;
        }

        
        const range_all_sliders = {
            'min': [     0 ],
            '10%': [   5,  5 ],
            '50%': [  40, 10 ],
            'max': [ 100 ]
        };

        
        const slider_range = document.getElementById('noui-slider-range');
        noUiSlider.create(slider_range, {
            start: [60],
            range: {
                'min': [20],
                'max': [100]
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });

        
        slider_behaviour = document.getElementById('noui-slider-behaviour');
        noUiSlider.create(slider_behaviour, {
            start: [ 30, 70 ],
            behaviour: 'drag',
            connect: true,
            range: {
                'min':  20,
                'max':  80
            },
            direction: document.dir == 'rtl' ? 'rtl' : 'ltr'
        });


        
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
    };


    
    
    

    return {
        initComponents: function() {
            _componentSelect2();
            _componentMultiselect();
            _componentColorPicker();
            _componentDatepicker();
            _componentDragula();
            _componentReload();
            _componentDualListbox();
            _componentFancytree();
            _componentLightbox();
            _componentNouiSlider();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    SidebarComponents.initComponents();
});
