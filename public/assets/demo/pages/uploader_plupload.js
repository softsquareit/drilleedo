





const Plupload = function() {


    
    
    

    
    const _componentPlupload = function() {
        if (!$().pluploadQueue) {
            console.warn('Warning - Plupload files are not loaded.');
            return;
        }

        
        $('.file-uploader').pluploadQueue({
            runtimes: 'html5, html4, Flash, Silverlight',
            url: '../../../assets/demo/data/uploader/plupload.json',
            chunk_size: '300Kb',
            unique_names: true,
            header: true,
            filters: {
                max_file_size: '300Kb',
                mime_types: [{
                    title: 'Image files',
                    extensions: 'jpg,gif,png'
                }]
            },
            resize: {
                width: 320,
                height: 240,
                quality: 90
            }
        });

        
        $('.html5-uploader').pluploadQueue({
            runtimes: 'html5',
            url: '../../../assets/demo/data/uploader/plupload.json',
            chunk_size: '300Kb',
            unique_names: true,
            filters: {
                max_file_size: '300Kb',
                mime_types: [{
                    title: 'Image files',
                    extensions: 'jpg,gif,png'
                }]
            },
            resize: {
                width: 320,
                height: 240,
                quality: 90
            }
        });

        
        $('.html4-uploader').pluploadQueue({
            runtimes: 'html4',
            url: '../../../assets/demo/data/uploader/plupload.json',
            unique_names: true,
            filters: {
                max_file_size: '300Kb',
                mime_types: [{
                    title: 'Image files',
                    extensions: 'jpg,gif,png'
                }]
            }
        });

        
        $('.uploader-events').pluploadQueue({
            runtimes: 'html5,flash,silverlight,html4',
            url: '../../../assets/demo/data/uploader/plupload.json',
            chunk_size: '300Kb',
            unique_names: true,
            resize: {
                width: 320,
                height: 240,
                quality: 90
            },
            filters: {
                max_file_size: '300Kb',
                mime_types: [{
                    title: 'Image files',
                    extensions: 'jpg,gif,png'
                }]
            },
            flash_swf_url: '../../../assets/js/vendor/uploaders/plupload/files/Moxie.swf',
            silverlight_xap_url: '/plupload/js/Moxie.xap',
            preinit: {
                Init: function(up, info) {
                    log('[Init]', 'Info:', info, 'Features:', up.features);
                },
                UploadFile: function(up, file) {
                    log('[UploadFile]', file);
                }
            },
            init: {
                Browse: function(up) {
                    log('[Browse]'); 
                },

                Refresh: function(up) {
                    log('[Refresh]'); 
                },

                StateChanged: function(up) {
                    log('[StateChanged]', up.state == plupload.STARTED ? 'STARTED': 'STOPPED'); 
                },

                QueueChanged: function(up) {
                    log('[QueueChanged]'); 
                },

                OptionChanged: function(up, name, value, oldValue) {
                    log('[OptionChanged]', 'Option Name: ', name, 'Value: ', value, 'Old Value: ', oldValue); 
                },

                BeforeUpload: function(up, file) {
                    log('[BeforeUpload]', 'File: ', file); 
                },

                UploadProgress: function(up, file) {
                    log('[UploadProgress]', 'File:', file, 'Total:', up.total); 
                },

                FileFiltered: function(up, file) {
                    log('[FileFiltered]', 'File:', file); 
                },

                FilesAdded: function(up, files) {
                    log('[FilesAdded]'); 

                    plupload.each(files, function(file) {
                        log('  File:', file);
                    });
                },

                FilesRemoved: function(up, files) {
                    log('[FilesRemoved]'); 

                    plupload.each(files, function(file) {
                        log('  File:', file);
                    });
                },

                FileUploaded: function(up, file, info) {
                    log('[FileUploaded] File:', file, 'Info:', info); 
                },

                ChunkUploaded: function(up, file, info) {
                    log('[ChunkUploaded] File:', file, 'Info:', info); 
                },

                UploadComplete: function(up, files) {
                    log('[UploadComplete]'); 
                },

                Destroy: function(up) {
                    log('[Destroy] '); 
                },

                Error: function(up, args) {
                    log('[Error] ', args); 
                }
            }
        });


        
        function log() {
            let str = '';

            plupload.each(arguments, function(arg) {
                let row = '';

                if (typeof(arg) != 'string') {
                    plupload.each(arg, function(value, key) {

                        
                        if (arg instanceof plupload.File) {

                            
                            switch (value) {
                                case plupload.QUEUED:
                                value = 'QUEUED';
                                break;

                                case plupload.UPLOADING:
                                value = 'UPLOADING';
                                break;

                                case plupload.FAILED:
                                value = 'FAILED';
                                break;

                                case plupload.DONE:
                                value = 'DONE';
                                break;
                            }
                        }

                        if (typeof(value) != 'function') {
                            row += (row ? ', ': '') + key + '=' + value;
                        }
                    });

                    str += row + ' ';
                }
                else {
                    str += arg + ' ';
                }
            });

            const log = $('#log');
            log.append(str + '<br>');
            log.scrollTop(log[0].scrollHeight);
        }
    };


    
    
    

    return {
        init: function() {
            _componentPlupload();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    Plupload.init();
});
