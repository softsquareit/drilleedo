





const PinkPalette = function() {


    
    
    

    
    const _componentSelect2 = function() {
        if (!$().select2) {
            console.warn('Warning - select2.min.js is not loaded.');
            return;
        }

        
        $('.form-control-select2').select2();
    };

    
    const _componentMultiselect = function() {
        if (!$().multiselect) {
            console.warn('Warning - bootstrap-multiselect.js is not loaded.');
            return;
        }

        
        $('.form-control-multiselect').multiselect({
            nonSelectedText: 'Select your state'
        });
    };

    
    const _componentNoty = function() {
        if (typeof Noty == 'undefined') {
            console.warn('Warning - noty.min.js is not loaded.');
            return;
        }

        
        const notyElement = document.querySelector('.noty-launch');
        if(notyElement) {
            notyElement.addEventListener('click', function() {
                new Noty({
                    layout: 'topRight',
                    theme: ' bg-pink text-white',
                    text: 'Check me out! I\'m a Noty notice.',
                    timeout: 2500
                }).show();
            });
        }
    };

    
    const _componentPopups = function() {

        
        const customTooltipElement = document.querySelector('[data-bs-popup=tooltip-custom]');
        if(customTooltipElement) {
            new bootstrap.Tooltip(customTooltipElement, {
                customClass: 'tooltip-custom',
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow border-pink"></div><div class="tooltip-inner bg-pink text-white"></div></div>'
            });
        }

        
        const customPopoverElement = document.querySelector('[data-bs-popup=popover-solid]');
        if(customPopoverElement) {
            new bootstrap.Popover(customPopoverElement, {
                customClass: 'popover-custom',
                template: '<div class="popover bg-pink border-pink"><div class="popover-arrow border-pink"></div><h3 class="popover-header bg-pink text-white border-white border-opacity-25"></h3><div class="popover-body text-white"></div></div>'
            });
        }
    };

    
    const _componentToast = function() {

        
        const toastHeaderTrigger = document.querySelector('#toast_header');
        const toastHeaderElement = document.querySelector('#toast_header_example');
        if (toastHeaderTrigger) {
            toastHeaderTrigger.addEventListener('click', function () {
                const toast = new bootstrap.Toast(toastHeaderElement);
                toast.show()
            });
        }

        
        const toastHeaderBorderTrigger = document.querySelector('#toast_header_border');
        const toastHeaderBorderElement = document.querySelector('#toast_header_border_example');
        if (toastHeaderBorderTrigger) {
            toastHeaderBorderTrigger.addEventListener('click', function () {
                const toast = new bootstrap.Toast(toastHeaderBorderElement);
                toast.show()
            });
        }

        
        const toastSolidTrigger = document.querySelector('#toast_solid');
        const toastSolidElement = document.querySelector('#toast_solid_example');
        if (toastSolidTrigger) {
            toastSolidTrigger.addEventListener('click', function () {
                const toast = new bootstrap.Toast(toastSolidElement);
                toast.show()
            });
        }
    };


    
    
    

    return {
        init: function() {
            _componentSelect2();
            _componentMultiselect();
            _componentNoty();
            _componentPopups();
            _componentToast();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    PinkPalette.init();
});
