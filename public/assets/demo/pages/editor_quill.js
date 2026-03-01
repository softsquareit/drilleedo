





const QuillEditor = function() {


    
    
    

    
    const _componentQuill = function() {
        if (typeof Quill == 'undefined') {
            console.warn('Warning - summernote.min.js is not loaded.');
            return;
        }

        
        

        
        const quillBasic = new Quill('.quill-basic', {
            bounds: '.content-inner',
            placeholder: 'Please add your text here...',
            theme: 'snow'
        });

        
        const quillFull = new Quill('.quill-full', {
            modules: {
                toolbar: [
                    [{ 'font': [] }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'header': 1 }, { 'header': 2 }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'script': 'sub'}, { 'script': 'super' }],
                    [{ 'indent': '-1'}, { 'indent': '+1' }],
                    [{ 'direction': 'rtl' }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    [ 'formula', 'image', 'video' ],
                    ['clean']
                ]
            },
            bounds: '.content-inner',
            placeholder: 'Please add your text here...',
            theme: 'snow'
        });

        
        const quillPlaceholder = new Quill('.quill-placeholder', {
            bounds: '.content-inner',
            placeholder: 'Please add your text here...',
            theme: 'snow'
        });

        
        const quillReadonly = new Quill('.quill-scrollable', {
            bounds: '.content-inner',
            scrollingContainer: 'quill-scrollable-container',
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
    QuillEditor.init();
});
