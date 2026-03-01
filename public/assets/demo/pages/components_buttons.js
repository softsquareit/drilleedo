





var Buttons = function() {


    
    
    

    
    
    
    
    
    

    
    
    
    
    

    
    
    
    
    
    
    

    
    
    
    
    
    
    
    

    
    var _componentLoadingButton = function() {
        const btnLoadingElement = document.querySelectorAll('.btn-loading');

        if(btnLoadingElement) {  
            btnLoadingElement.forEach(function(button) {
                button.addEventListener('click', function() {
                    const initialText = button.dataset.initialText,
                        loadingText = button.dataset.loadingText;
                    button.innerHTML = loadingText;
                    button.classList.add('disabled');
                    setTimeout(function () {
                        button.innerHTML = initialText;
                        button.classList.remove('disabled');
                    }, 3000);
                });
            });
        }
    };


    
    
    

    return {
        init: function() {
            
            _componentLoadingButton();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    Buttons.init();
});
