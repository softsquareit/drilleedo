





const Dashboard = function () {


    
    
    

    
    const _componentIconLetter = function() {

        
        const getInitials = function(string) {
            const names = string.split(' ');
            let initials = names[0].substring(0, 1).toUpperCase();
            
            if (names.length > 1) {
                initials += names[names.length - 1].substring(0, 1).toUpperCase();
            }
            return initials;
        };

        
        document.querySelectorAll('.letter-icon-title').forEach(function(label) {
            const fullName = label.textContent;
            const initials = getInitials(fullName);
            const icon = label.closest('tr').querySelector('.letter-icon');
            icon && icon.append(initials);
        });
    };


    
    
    

    return {
        initComponents: function() {
            _componentIconLetter();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    Dashboard.initComponents();
});
