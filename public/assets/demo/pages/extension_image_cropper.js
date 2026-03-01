





var ImageCropper = function() {


    
    
    

    
    var _componentImageCropper = function() {
        if (typeof Cropper == 'undefined') {
            console.warn('Warning - cropper.min.js is not loaded.');
            return;
        }

        
        const elBasic = document.querySelector('.crop-basic');
        new Cropper(elBasic);

        
        const elModal = document.querySelector('.crop-modal');
        new Cropper(elModal, {
            modal: false
        });

        
        const elNotMovable = document.querySelector('.crop-not-movable');
        new Cropper(elNotMovable, {
            cropBoxMovable: false,
            data: {
                x: 75,
                y: 50,
                width: 350,
                height: 250
            }
        });

        
        const elNotResizable = document.querySelector('.crop-not-resizable');
        new Cropper(elNotResizable, {
            cropBoxResizable: false,
            data: {
                x: 10,
                y: 10,
                width: 300,
                height: 300
            }
        });

        
        const elAutoCrop = document.querySelector('.crop-auto');
        new Cropper(elAutoCrop, {
            autoCrop: false 
        });

        
        const elDragDisabled = document.querySelector('.crop-drag');
        new Cropper(elDragDisabled, {
            movable: false 
        });

        
        const el16x9 = document.querySelector('.crop-16-9');
        new Cropper(el16x9, {
            aspectRatio: 16/9
        });

        
        const el4x3 = document.querySelector('.crop-4-3');
        new Cropper(el4x3, {
            aspectRatio: 4/3
        });

        
        const elCropMin = document.querySelector('.crop-min');
        new Cropper(elCropMin, {
            minCropBoxWidth: 150,
            minCropBoxHeight: 150
        });

        
        const elZoomDisabled = document.querySelector('.crop-zoomable');
        new Cropper(elZoomDisabled, {
            zoomable: false
        });


        
        

        var container = document.querySelector('.image-cropper-container');
        var image = document.querySelector('#demo-cropper-image');
        var download = document.getElementById('download');
        var actions = document.getElementById('actions');
        var dataX = document.getElementById('dataX');
        var dataY = document.getElementById('dataY');
        var dataHeight = document.getElementById('dataHeight');
        var dataWidth = document.getElementById('dataWidth');
        var dataRotate = document.getElementById('dataRotate');
        var dataScaleX = document.getElementById('dataScaleX');
        var dataScaleY = document.getElementById('dataScaleY');
        var options = {
            aspectRatio: 1 / 1,
            preview: '.preview',
            ready: function (e) {
                console.log(e.type);
            },
            cropstart: function (e) {
                console.log(e.type, e.detail.action);
            },
            cropmove: function (e) {
                console.log(e.type, e.detail.action);
            },
            cropend: function (e) {
                console.log(e.type, e.detail.action);
            },
            crop: function (e) {
                var data = e.detail;

                dataX.value = Math.round(data.x);
                dataY.value = Math.round(data.y);
                dataHeight.value = Math.round(data.height);
                dataWidth.value = Math.round(data.width);
                dataScaleX.value = typeof data.scaleX !== 'undefined' ? data.scaleX : '';
                dataScaleY.value = typeof data.scaleY !== 'undefined' ? data.scaleY : '';
            },
            zoom: function (e) {
                console.log(e.type, e.detail.ratio);
            }
        };
        var cropper = new Cropper(image, options);
        var originalImageURL = image.src;
        var uploadedImageType = 'image/jpeg';
        var uploadedImageName = 'cropped.jpg';
        var uploadedImageURL;

        
        if (typeof download.download === 'undefined') {
            download.className += ' disabled';
            download.title = 'Your browser does not support download';
        }

        
        document.querySelectorAll('.demo-cropper-toolbar').forEach(function(btn) {
            btn.addEventListener('click', function () {
                var e = event || window.event;
                var target = e.target || e.srcElement;
                var cropped;
                var result;
                var input;
                var data;

                while (target !== this) {
                    if (target.getAttribute('data-method')) {
                        break;
                    }

                    target = target.parentNode;
                }

                if (target === this || target.disabled || target.className.indexOf('disabled') > -1) {
                    return;
                }

                data = {
                    method: target.getAttribute('data-method'),
                    target: target.getAttribute('data-target'),
                    option: target.getAttribute('data-option') || undefined,
                    secondOption: target.getAttribute('data-second-option') || undefined
                };

                cropped = cropper.cropped;

                if (data.method) {
                    switch (data.method) {
                        case 'getCroppedCanvas':
                        try {
                            data.option = JSON.parse(data.option);
                        } catch (e) {
                            console.log(e.message);
                        }

                        if (uploadedImageType === 'image/jpeg') {
                            if (!data.option) {
                                data.option = {};
                            }

                            data.option.fillColor = '#fff';
                        }

                        break;
                    }

                    result = cropper[data.method](data.option, data.secondOption);

                    switch (data.method) {
                        case 'scaleX':
                        case 'scaleY':
                        target.setAttribute('data-option', -data.option);
                        break;

                        case 'getCroppedCanvas':
                        if (result) {
                            document.querySelector('#getCroppedCanvasModal .modal-body').appendChild(result);

                            document.querySelector('#getCroppedCanvasModal').addEventListener('hidden.bs.modal', function() {
                                document.querySelector('#getCroppedCanvasModal .modal-body').innerHTML = '';
                            });

                            if (!download.disabled) {
                                download.download = uploadedImageName;
                                download.href = result.toDataURL(uploadedImageType);
                            }
                        }

                        break;
                    }
                }
            });
        });


        
        
        

        document.querySelectorAll('.demo-cropper-ratio input[type=radio]').forEach(function(radio) {
            radio.addEventListener('change', function () {
                options[radio.getAttribute('name')] = radio.value;
                cropper.destroy();
                cropper = new Cropper(image, options);
            });
        });


        
        
        

        
        var cropClear = document.querySelector('.clear-crop-switch');
        cropClear.addEventListener('change', function() {
            if(cropClear.checked) {

                
                cropper.crop();

                
                enableDisable.disabled = false;
                destroyCreate.disabled = false;
            }
            else {

                
                cropper.clear();

                
                enableDisable.disabled = true;
                destroyCreate.disabled = true;
            }
        });

        
        var enableDisable = document.querySelector('.enable-disable-switch');
        enableDisable.addEventListener('change', function() {
            if(enableDisable.checked) {

                
                cropper.enable();

                
                cropClear.disabled = false;
                destroyCreate.disabled = false;
            }
            else {

                
                cropper.disable();

                
                cropClear.disabled = true;
                destroyCreate.disabled = true;
            }
        });

        
        var destroyCreate = document.querySelector('.destroy-create-switch');
        destroyCreate.addEventListener('change', function() {
            if(destroyCreate.checked) {

                
                cropper = new Cropper(image, options);

                
                cropClear.disabled = false;
                enableDisable.disabled = false;
            }
            else {

                
                cropper.destroy();
                
                
                cropClear.disabled = true;
                enableDisable.disabled = true;
            }
        });


        
        
        

        
        document.querySelector('#getData').addEventListener('click', function() {
            document.querySelector('#showData1').value = JSON.stringify(cropper.getData());
        });

        
        document.querySelector('#setData').addEventListener('click', function() {
            cropper.setData({
                x: 291,
                y: 86,
                width: 158,
                height: 158
            });

            document.querySelector('#showData1').value = 'Image data has been changed';
        });


        
        document.querySelector('#getContainerData').addEventListener('click', function() {
            document.querySelector('#showData2').value = JSON.stringify(cropper.getContainerData());
        });

        
        document.querySelector('#getImageData').addEventListener('click', function() {
            document.querySelector('#showData2').value = JSON.stringify(cropper.getImageData());
        });


        
        document.querySelector('#getCanvasData').addEventListener('click', function() {
            document.querySelector('#showData3').value = JSON.stringify(cropper.getCanvasData());
        });

        
        document.querySelector('#setCanvasData').addEventListener('click', function() {
            cropper.setCanvasData({
                left: -50,
                top: 0,
                width: 750,
                height: 750
            });

            document.querySelector('#showData3').value = 'Canvas data has been changed';
        });


        
        document.querySelector('#getCropBoxData').addEventListener('click', function() {
            document.querySelector('#showData4').value = JSON.stringify(cropper.getCropBoxData());
        });

        
        document.querySelector('#setCropBoxData').addEventListener('click', function() {
            cropper.setCropBoxData({
                left: 395,
                top: 68,
                width: 183,
                height: 183
            });

            document.querySelector('#showData4').value = 'Crop box data has been changed';
        });
    };


    
    
    

    return {
        init: function() {
            _componentImageCropper();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    ImageCropper.init();
});
