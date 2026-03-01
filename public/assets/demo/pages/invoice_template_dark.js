





var InvoiceTemplate = function() {


    
    
    

    
    var _componentCKEditor = function() {
        if (typeof CKEDITOR == 'undefined') {
            console.warn('Warning - ckeditor.js is not loaded.');
            return;
        }

	    
        CKEDITOR.config.floatSpacePinnedOffsetY = 56;
        CKEDITOR.config.customConfig = 'config_dark.js';
	    CKEDITOR.disableAutoInline = true;
	    CKEDITOR.dtd.$removeEmpty['i'] = false;
	    CKEDITOR.config.startupShowBorders = false;
	    CKEDITOR.config.extraAllowedContent = 'table(*)';
    };


    
    
    

    return {
        init: function() {
            _componentCKEditor();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    InvoiceTemplate.init();
});
