





const IdleTimeout = function() {


    
    
    

    
    const _componentIdleTimeout = function() {
        if (!$.sessionTimeout) {
            console.warn('Warning - session_timeout.min.js is not loaded.');
            return;
        }

        
        $.sessionTimeout({
            title: 'Idle Timeout',
            message: 'Your session is about to expire. Do you want to stay connected?',
            warnAfter: 5000,
            redirAfter: 15000,
            redirUrl: 'login_unlock.html',
            logoutUrl: 'login_advanced.html'
        });
    };


    
    
    

    return {
        init: function() {
            _componentIdleTimeout();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    IdleTimeout.init();
});
