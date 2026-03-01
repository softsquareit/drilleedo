





var FormLayouts = function() {


    
    
    

    
    var _componentSelect2 = function() {
        if (!$().select2) {
            console.warn('Warning - select2.min.js is not loaded.');
            return;
        };

        
        $('.form-control-select2').select2();


        
        
        

        
        function iconFormat(icon) {
            var originalOption = icon.element;
            if (!icon.id) { return icon.text; }
            var $icon = '<i class="ph-' + $(icon.element).data('icon') + '"></i>' + icon.text;

            return $icon;
        }

        
        $('.form-control-select2-icons').select2({
            templateResult: iconFormat,
            minimumResultsForSearch: Infinity,
            templateSelection: iconFormat,
            escapeMarkup: function(m) { return m; }
        });
    };


    
    
    

    return {
        init: function() {
            _componentSelect2();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    FormLayouts.init();
});
