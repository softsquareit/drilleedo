





const MailListWrite = function() {


    
    
    

    
    const _componentQuill = function() {
        if (typeof Quill == 'undefined') {
            console.warn('Warning - quill.min.js is not loaded.');
            return;
        }

        
        

        
        const quillBasic = new Quill('#editor', {
            bounds: '.content-inner',
            placeholder: 'Please add your text here...',
            theme: 'snow'
        });
    };


    
    
    

    return {
        init: function() {
            _componentQuill();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    MailListWrite.init();
});
