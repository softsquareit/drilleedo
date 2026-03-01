





const ExtendedFormControls = function() {


    
    
    

    
    const _componentMaskInput = function() {
        if (typeof IMask == 'undefined') {
            console.warn('Warning - imask.min.js is not loaded.');
            return;
        }

        
        const maskDateElement = document.querySelector('#mask_date');
        if(maskDateElement) {
            const maskDate = IMask(maskDateElement, {
                mask: Date,
                min: new Date(1990, 0, 1),
                max: new Date(2020, 0, 1)
            });
        }

        
        const maskPhoneElement = document.querySelector('#mask_phone');
        if(maskPhoneElement) {
            const maskPhone = IMask(maskPhoneElement, {
                mask: '+{3}(000)000-00-00'
            });
        }

        
        const maskPhoneExtElement = document.querySelector('#mask_phone_ext');
        if(maskPhoneExtElement) {
            const maskPhoneExt = IMask(maskPhoneExtElement, {
                mask: '+{3}(000)000-00-00 / a00000'
            });
        }

        
        const maskPhoneIntElement = document.querySelector('#mask_phone_int');
        if(maskPhoneIntElement) {
            const maskPhoneInt = IMask(maskPhoneIntElement, {
                mask: '+{3}0 000 000 000'
            });
        }

        
        const maskCurrencyElement = document.querySelector('#mask_currency');
        if(maskCurrencyElement) {
            const maskCurrency = IMask(maskCurrencyElement, {
                mask: '$num',
                blocks: {
                    num: {
                        mask: Number,
                        thousandsSeparator: ','
                    }
                }
            });
        }

        
        const maskTaxElement = document.querySelector('#mask_tax');
        if(maskTaxElement) {
            const maskTax = IMask(maskTaxElement, {
                mask: '00-000000'
            });
        }

        
        const maskSsnElement = document.querySelector('#mask_ssn');
        if(maskSsnElement) {
            const maskSsn = IMask(maskSsnElement, {
                mask: '000-00-0000'
            });
        }

        
        const maskCardElement = document.querySelector('#mask_card');
        if(maskCardElement) {
            const maskCard = IMask(maskCardElement, {
                mask: '0000-0000-0000-0000'
            });
        }

        
        const maskProductKeyElement = document.querySelector('#mask_product_key');
        if(maskProductKeyElement) {
            const maskProductKey = IMask(maskProductKeyElement, {
                mask: 'a*-000-a000'
            });
        }

        
        const maskOrderElement = document.querySelector('#mask_order');
        if(maskOrderElement) {
            const maskOrder = IMask(maskOrderElement, {
                mask: 'aaa-000-***'
            });
        }

        
        const maskIsbnElement = document.querySelector('#mask_isbn');
        if(maskIsbnElement) {
            const maskIsbn = IMask(maskIsbnElement, {
                mask: '000-00-000-0000-0'
            });
        }

        
        const maskDynamicElment = document.querySelector('#mask_dynamic');
        if(maskDynamicElment) {
            const maskDynamic = IMask(maskDynamicElment, {
                mask: [
                    {
                        mask: '+{3}(000)000-00-00'
                    },
                    {
                        mask: /^\S*@?\S*$/
                    }
                ]
            });
        }
    };

    
    const _componentAutosize = function() {
        if (typeof autosize == 'undefined') {
            console.warn('Warning - autosize.min.js is not loaded.');
            return;
        }

        
        autosize(document.querySelectorAll('.elastic'));

        
        const manualElement = document.querySelector('.elastic-manual');
        const manualElementTrigger = document.querySelector('.elastic-manual-trigger');
        manualElementTrigger.addEventListener('click', function() {
            const manual = autosize(manualElement);
            manualElement.value = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sed ultricies nibh, sed faucibus eros. Vivamus tristique fringilla ante, vitae pellentesque quam porta vel. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc vehicula gravida nisl non imperdiet. Mauris felis odio, vehicula et laoreet non, tempor non enim. Cras convallis sapien hendrerit nibh sagittis sollicitudin. Fusce nec ultricies justo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce ac urna in dui consequat cursus vel sit amet mauris. Proin nec bibendum arcu. Aenean sit amet nisi mi. Sed non leo nisl. Mauris leo odio, ultricies interdum ornare ac, posuere eu risus. Suspendisse adipiscing sapien sit amet gravida sollicitudin. Maecenas laoreet velit in dui adipiscing, vel fermentum tellus ullamcorper. Nullam et mi rhoncus, tempus nulla sit amet, varius ipsum.';
            autosize.update(manual);
        });

        
        const eventsElement = document.querySelector('.elastic-events');
        const eventsElementTrigger = document.querySelector('.elastic-events-trigger');
        eventsElementTrigger.addEventListener('click', function() {
            const events = autosize(eventsElement);
            eventsElement.value = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sed ultricies nibh, sed faucibus eros. Vivamus tristique fringilla ante, vitae pellentesque quam porta vel. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc vehicula gravida nisl non imperdiet. Mauris felis odio, vehicula et laoreet non, tempor non enim. Cras convallis sapien hendrerit nibh sagittis sollicitudin. Fusce nec ultricies justo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce ac urna in dui consequat cursus vel sit amet mauris. Proin nec bibendum arcu. Aenean sit amet nisi mi. Sed non leo nisl. Mauris leo odio, ultricies interdum ornare ac, posuere eu risus. Suspendisse adipiscing sapien sit amet gravida sollicitudin. Maecenas laoreet velit in dui adipiscing, vel fermentum tellus ullamcorper. Nullam et mi rhoncus, tempus nulla sit amet, varius ipsum.';
            autosize.update(events);
        });
        eventsElement.addEventListener('autosize:resized', function(){
          console.log('textarea height updated');
        });

        
        const destroyAutosize = autosize(document.querySelector('.elastic-destroy'));
        document.querySelector('.elastic-destroy-trigger').addEventListener('click', function() {
            autosize.destroy(destroyAutosize);
        });
    };

    
    const _componentPassy = function() {
        if (!$().passy) {
            console.warn('Warning - passy.js is not loaded.');
            return;
        }

        
        const $inputText = $('.text-indicator');
        const $inputLabel = $('.badge-indicator');
        const $inputLabelAbsolute = $('.badge-indicator-absolute');
        const $inputGroup = $('.group-indicator');

        
        const $outputText = $('.password-indicator-text');
        const $outputLabel = $('.password-indicator-badge');
        const $outputLabelAbsolute = $('.password-indicator-badge-absolute');
        const $outputGroup = $('.password-indicator-group');



        
        $.passy.requirements.length.min = 4;


        
        const feedbackText = [
            {text: '<i class="ph-check me-1"></i> Your password is weak', color: 'text-danger'},
            {text: '<i class="ph-check me-1"></i> Your password is normal', color: 'text-secondary'},
            {text: '<i class="ph-shield-check me-1"></i> Your password is good', color: 'text-primary'},
            {text: '<i class="ph-shield-check me-1"></i> Your password is strong', color: 'text-success'}
        ];
        const feedbackLabel = [
            {color: 'bg-danger', text: 'Weak'},
            {color: 'bg-secondary', text: 'Normal'},
            {color: 'bg-primary', text: 'Good'},
            {color: 'bg-success', text: 'Strong'}
        ];
        const feedbackGroup = [
            {color: 'bg-danger border-danger text-white', text: 'Weak'},
            {color: 'bg-secondary border-secondary text-white', text: 'Normal'},
            {color: 'bg-primary border-primary text-white', text: 'Good'},
            {color: 'bg-success border-success text-white', text: 'Strong'}
        ];


        
        
        

        
        $inputText.passy(function(strength) {
            $outputText.html(feedbackText[strength].text);
            $outputText.addClass(feedbackText[strength].color);
        });

        
        $inputLabel.passy(function(strength) {
            $outputLabel.text(feedbackLabel[strength].text);
            $outputLabel.addClass(feedbackLabel[strength].color);
        });

        
        $inputLabelAbsolute.passy(function(strength) {
            $outputLabelAbsolute.text(feedbackLabel[strength].text);
            $outputLabelAbsolute.addClass(feedbackLabel[strength].color);
        });

        
        $inputGroup.passy(function(strength) {
            $outputGroup.text(feedbackGroup[strength].text);
            $outputGroup.addClass(feedbackGroup[strength].color);
        });


        
        
        

        
        $('.generate-text').on('click', function() {
            $inputText.passy('generate', 12);
        });

        
        $('.generate-badge').on('click', function() {
            $inputLabel.passy('generate', 12);
        });

        
        $('.generate-badge-absolute').on('click', function() {
            $inputLabelAbsolute.passy('generate', 10);
        });

        
        $('.generate-group').on('click', function() {
            $inputGroup.passy('generate', 8);
        });
    };

    
    const _componentMaxlength = function() {
        if (!$().maxlength) {
            console.warn('Warning - maxlength.min.js is not loaded.');
            return;
        }

        
        $('.maxlength').maxlength({
            placement: document.dir == "rtl" ? 'bottom-left-inside' : 'bottom-right-inside'
        });

        
        $('.maxlength-threshold').maxlength({
            threshold: 15,
            placement: document.dir == "rtl" ? 'bottom-left-inside' : 'bottom-right-inside'
        });

        
        $('.maxlength-custom').maxlength({
            threshold: 10,
            warningClass: 'badge bg-primary form-text',
            limitReachedClass: 'badge bg-danger form-text',
            placement: document.dir == "rtl" ? 'bottom-left-inside' : 'bottom-right-inside'
        });

        
        $('.maxlength-options').maxlength({
            alwaysShow: true,
            threshold: 10,
            warningClass: 'text-success form-text',
            limitReachedClass: 'text-danger form-text',
            separator: ' of ',
            preText: 'You have ',
            postText: ' chars remaining.',
            validate: true,
            placement: document.dir == "rtl" ? 'bottom-left-inside' : 'bottom-right-inside'
        });

        
        $('.maxlength-textarea').maxlength({
            alwaysShow: true,
            placement: document.dir == "rtl" ? 'bottom-left-inside' : 'bottom-right-inside'
        });

        
        $('.maxlength-badge-position').maxlength({
            alwaysShow: true,
            placement: 'centered-right',
            warningClass: 'text-success left-auto right-0 top-50 translate-middle-y pe-2 mr-1',
            limitReachedClass: 'text-danger left-auto right-0 top-50 translate-middle-y pe-2 mr-1',
            placement: document.dir == "rtl" ? 'centered-left' : 'centered-right'
        });
    };


    
    
    

    return {
        init: function() {
            _componentMaskInput();
            _componentAutosize();
            _componentPassy();
            _componentMaxlength();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    ExtendedFormControls.init();
});
