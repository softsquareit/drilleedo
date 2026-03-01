





const FormValidation = function() {


    
    
    

    
    const _componentSelect2 = function() {
        if (!$().select2) {
            console.warn('Warning - select2.min.js is not loaded.');
            return;
        }

        
        const $select = $('.form-control-select2').select2({
            minimumResultsForSearch: Infinity
        });

        
        $select.on('change', function() {
            $(this).trigger('blur');
        });
    };

    
    const _componentValidation = function() {
        if (!$().validate) {
            console.warn('Warning - validate.min.js is not loaded.');
            return;
        }

        
        const validator = $('.form-validate-jquery').validate({
            ignore: 'input[type=hidden], .select2-search__field', 
            errorClass: 'validation-invalid-label',
            successClass: 'validation-valid-label',
            validClass: 'validation-valid-label',
            highlight: function(element, errorClass) {
                $(element).removeClass(errorClass);
            },
            unhighlight: function(element, errorClass) {
                $(element).removeClass(errorClass);
            },
            success: function(label) {
                label.addClass('validation-valid-label').text('Success.'); 
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
                password: {
                    minlength: 5
                },
                repeat_password: {
                    equalTo: '#password'
                },
                email: {
                    email: true
                },
                repeat_email: {
                    equalTo: '#email'
                },
                minimum_characters: {
                    minlength: 10
                },
                maximum_characters: {
                    maxlength: 10
                },
                minimum_number: {
                    min: 10
                },
                maximum_number: {
                    max: 10
                },
                number_range: {
                    range: [10, 20]
                },
                url: {
                    url: true
                },
                date: {
                    date: true
                },
                date_iso: {
                    dateISO: true
                },
                numbers: {
                    number: true
                },
                digits: {
                    digits: true
                },
                creditcard: {
                    creditcard: true
                },
                basic_checkbox: {
                    minlength: 2
                },
                styled_checkbox: {
                    minlength: 2
                },
                switch_group: {
                    minlength: 2
                }
            },
            messages: {
                custom: {
                    required: 'This is a custom error message'
                },
                basic_checkbox: {
                    minlength: 'Please select at least {0} checkboxes'
                },
                styled_checkbox: {
                    minlength: 'Please select at least {0} checkboxes'
                },
                switch_group: {
                    minlength: 'Please select at least {0} switches'
                },
                agree: 'Please accept our policy'
            }
        });

        
        $('#reset').on('click', function() {
            validator.resetForm();
        });
    };


    
    
    

    return {
        init: function() {
            _componentSelect2();
            _componentValidation();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    FormValidation.init();
});
