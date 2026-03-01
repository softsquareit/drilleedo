





const DropzoneUploader = function() {


    
    
    

    
    const _componentDropzone = function() {
        if (typeof Dropzone == 'undefined') {
            console.warn('Warning - dropzone.min.js is not loaded.');
            return;
        }

        
        let dropzoneMultiple = new Dropzone("#dropzone_multiple", {
            url: "#",
            paramName: "file", 
            dictDefaultMessage: 'Drop files to upload <div>or CLICK</div>',
            maxFilesize: 0.1 
        });

        
        let dropzoneSingle = new Dropzone("#dropzone_single", {
            url: "#",
            paramName: "file", 
            maxFilesize: 1, 
            maxFiles: 1,
            dictDefaultMessage: 'Drop file to upload <span>or CLICK</span>',
            autoProcessQueue: false,
            init: function() {
                this.on('addedfile', function(file){
                    if (this.fileTracker) {
                    this.removeFile(this.fileTracker);
                }
                    this.fileTracker = file;
                });
            }
        });

        
        let dropzoneFiles = new Dropzone("#dropzone_accepted_files", {
            url: "#",
            paramName: "file", 
            dictDefaultMessage: 'Drop files to upload <span>or CLICK</span>',
            maxFilesize: 1, 
            acceptedFiles: 'image/*'
        });

        
        let dropzoneRemove = new Dropzone("#dropzone_remove", {
            url: "#",
            paramName: "file", 
            dictDefaultMessage: 'Drop files to upload <span>or CLICK</span>',
            maxFilesize: 1, 
            addRemoveLinks: true
        });

        
        let dropzoneFileLimits = new Dropzone("#dropzone_file_limits", {
            url: "#",
            paramName: "file", 
            dictDefaultMessage: 'Drop files to upload <span>or CLICK</span>',
            maxFilesize: 0.4, 
            maxFiles: 4,
            maxThumbnailFilesize: 1,
            addRemoveLinks: true
        });
    };


    
    
    

    return {
        init: function() {
            _componentDropzone();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DropzoneUploader.init();
});
