





const TableElements = function() {


    
    
    

    
    const _componentMultiselect = function() {
        if (!$().multiselect) {
            console.warn('Warning - bootstrap-multiselect.js is not loaded.');
            return;
        }

        
        $('.form-control-multiselect').multiselect();
    };

    
    const _componentSelect2 = function() {
        if (!$().select2) {
            console.warn('Warning - select2.min.js is not loaded.');
            return;
        }

        
        $('.form-control-select2').select2({
            minimumResultsForSearch: Infinity
        });


        
        
        

        
        function iconFormat(icon) {
            const originalOption = icon.element;
            if (!icon.id) { return icon.text; }
            const $icon = "<i class='ph-" + $(icon.element).data('icon') + "'></i>" + icon.text;

            return $icon;
        }

        
        $('.form-control-select2-actions').select2({
            templateResult: iconFormat,
            minimumResultsForSearch: Infinity,
            templateSelection: iconFormat,
            escapeMarkup: function(m) { return m; }
        });


        
        
        

        
        var controls = document.querySelector('#enable_controls');

        
        controls.addEventListener('change', function() {
            if(controls.checked) {
                $('#available_controls').prop('disabled', false);
            }
            else {
                $('#available_controls').prop('disabled', true);
            }
        });
    };

    
    const _componentFileUpload = function() {
        if (!$().fileinput) {
            console.warn('Warning - fileinput.min.js is not loaded.');
            return;
        }

        
        $('.bootstrap-uploader').fileinput({
            browseLabel: 'Browse',
            browseIcon: '<i class="icon-file-plus mr-2"></i>',
            uploadIcon: '<i class="icon-file-upload2 mr-2"></i>',
            removeIcon: '<i class="icon-cross2 font-size-base mr-2"></i>',
            layoutTemplates: {
                icon: '<i class="icon-file-check"></i>'
            },
            initialCaption: 'No file selected'
        });
    };


    
    
    

    return {
        init: function() {
            _componentMultiselect();
            _componentSelect2();
            _componentFileUpload();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    TableElements.init();
});
