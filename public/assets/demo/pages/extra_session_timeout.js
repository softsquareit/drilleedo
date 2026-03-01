





const SessionTimeout = function() {


    
    
    

    
    const _componentSessionTimeout = function() {
        if (!$.sessionTimeout) {
            console.warn('Warning - session_timeout.min.js is not loaded.');
            return;
        }

        
        $.sessionTimeout({
            title: 'Session Timeout',
            message: 'Your session is about to expire. Do you want to stay connected?',
            ignoreUserActivity: true,
            warnAfter: 10000,
            redirAfter: 30000,
            redirUrl: 'login_unlock.html',
            logoutUrl: 'login_advanced.html'
        });
    };


    
    
    

    return {
        init: function() {
            _componentSessionTimeout();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    SessionTimeout.init();
});
