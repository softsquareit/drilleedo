





const FormWizard = function() {


    
    
    

    
    const _componentWizard = function() {
        if (!$().steps) {
            console.warn('Warning - steps.min.js is not loaded.');
            return;
        }

        
        $('.steps-basic').steps({
            headerTag: 'h6',
            bodyTag: 'fieldset',
            transitionEffect: 'fade',
            titleTemplate: '<span class="number">#index#</span> #title#',
            labels: {
                previous: document.dir == 'rtl' ? '<i class="ph-arrow-circle-right me-2"></i> Previous' : '<i class="ph-arrow-circle-left me-2"></i> Previous',
                next: document.dir == 'rtl' ? 'Next <i class="ph-arrow-circle-left ms-2"></i>' : 'Next <i class="ph-arrow-circle-right ms-2"></i>',
                finish: 'Submit form <i class="ph-paper-plane-tilt ms-2"></i>'
            },
            onFinished: function (event, currentIndex) {
                alert('Form submitted.');
            }
        });

        
        $('.steps-async').steps({
            headerTag: 'h6',
            bodyTag: 'fieldset',
            transitionEffect: 'fade',
            titleTemplate: '<span class="number">#index#</span> #title#',
            loadingTemplate: '<div class="card-body text-center"><i class="icon-spinner2 spinner me-2"></i>  #text#</div>',
            labels: {
                previous: document.dir == 'rtl' ? '<i class="ph-arrow-circle-right me-2"></i> Previous' : '<i class="ph-arrow-circle-left me-2"></i> Previous',
                next: document.dir == 'rtl' ? 'Next <i class="ph-arrow-circle-left ms-2"></i>' : 'Next <i class="ph-arrow-circle-right ms-2"></i>',
                finish: 'Submit form <i class="ph-paper-plane-tilt ms-2"></i>'
            },
            onContentLoaded: function (event, currentIndex) {
                $(this).find('.card-body').addClass('hide');
            },
            onFinished: function (event, currentIndex) {
                alert('Form submitted.');
            }
        });

        
        $('.steps-starting-step').steps({
            headerTag: 'h6',
            bodyTag: 'fieldset',
            titleTemplate: '<span class="number">#index#</span> #title#',
            labels: {
                previous: document.dir == 'rtl' ? '<i class="ph-arrow-circle-right me-2"></i> Previous' : '<i class="ph-arrow-circle-left me-2"></i> Previous',
                next: document.dir == 'rtl' ? 'Next <i class="ph-arrow-circle-left ms-2"></i>' : 'Next <i class="ph-arrow-circle-right ms-2"></i>',
                finish: 'Submit form <i class="ph-paper-plane-tilt ms-2"></i>'
            },
            transitionEffect: 'fade',
            startIndex: 2,
            autoFocus: true,
            onFinished: function (event, currentIndex) {
                alert('Form submitted.');
            }
        });

        
        $('.steps-enable-all').steps({
            headerTag: 'h6',
            bodyTag: 'fieldset',
            transitionEffect: 'fade',
            enableAllSteps: true,
            titleTemplate: '<span class="number">#index#</span> #title#',
            labels: {
                previous: document.dir == 'rtl' ? '<i class="ph-arrow-circle-right me-2"></i> Previous' : '<i class="ph-arrow-circle-left me-2"></i> Previous',
                next: document.dir == 'rtl' ? 'Next <i class="ph-arrow-circle-left ms-2"></i>' : 'Next <i class="ph-arrow-circle-right ms-2"></i>',
                finish: 'Submit form <i class="ph-paper-plane-tilt ms-2"></i>'
            },
            onFinished: function (event, currentIndex) {
                alert('Form submitted.');
            }
        });


        
        
        

        
        if (!$().validate) {
            console.warn('Warning - validate.min.js is not loaded.');
            return;
        }

        
        const validationExampleElement = $('.steps-validation');
        const form = validationExampleElement.show();


        
        validationExampleElement.steps({
            headerTag: 'h6',
            bodyTag: 'fieldset',
            titleTemplate: '<span class="number">#index#</span> #title#',
            labels: {
                previous: document.dir == 'rtl' ? '<i class="ph-arrow-circle-right me-2"></i> Previous' : '<i class="ph-arrow-circle-left me-2"></i> Previous',
                next: document.dir == 'rtl' ? 'Next <i class="ph-arrow-circle-left ms-2"></i>' : 'Next <i class="ph-arrow-circle-right ms-2"></i>',
                finish: 'Submit form <i class="ph-paper-plane-tilt ms-2"></i>'
            },
            transitionEffect: 'fade',
            autoFocus: true,
            onStepChanging: function (event, currentIndex, newIndex) {

                
                if (currentIndex > newIndex) {
                    return true;
                }

                
                if (currentIndex < newIndex) {

                    
                    form.find('.body:eq(' + newIndex + ') label.error').remove();
                    form.find('.body:eq(' + newIndex + ') .error').removeClass('error');
                }

                form.validate().settings.ignore = ':disabled,:hidden';
                return form.valid();
            },
            onFinishing: function (event, currentIndex) {
                form.validate().settings.ignore = ':disabled';
                return form.valid();
            },
            onFinished: function (event, currentIndex) {
                alert('Submitted!');
            }
        });


        
        validationExampleElement.validate({
            ignore: 'input[type=hidden], .select2-search__field', 
            errorClass: 'validation-invalid-label',
            highlight: function(element, errorClass) {
                $(element).removeClass(errorClass);
            },
            unhighlight: function(element, errorClass) {
                $(element).removeClass(errorClass);
            },

            
            errorPlacement: function(error, element) {

                
                if (element.hasClass('select2-hidden-accessible')) {
                    error.appendTo(element.parent());
                }

                
                else if (element.parents().hasClass('form-control-feedback') || element.parents().hasClass('form-check') || element.parents().hasClass('input-group')) {
                    error.appendTo(element.parent().parent());
                }

                
                else {
                    error.insertAfter(element);
                }
            },
            rules: {
                email: {
                    email: true
                }
            }
        });
    };


    
    
    

    return {
        init: function() {
            _componentWizard();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    FormWizard.init();
});
