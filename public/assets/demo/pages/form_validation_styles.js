





const FormValidationStyles = function() {


    
    
    

    
    const _componentValidationCustom = function() {

        
        var forms = document.querySelectorAll('.needs-validation');

        
        forms.forEach(function(form) {
            form.addEventListener('submit', function(e) {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                form.classList.add('was-validated');
            }, false);
        });
    };


    
    
    

    return {
        init: function() {
            _componentValidationCustom();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    FormValidationStyles.init();
});
