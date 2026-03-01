





var MailList = function() {


    
    
    

    
    var _componentTableInbox = function() {

        
        var highlightColorClass = 'table-primary';

        
        document.querySelectorAll('.table-inbox-checkbox input[type=checkbox]').forEach(function(checkbox) {
            checkbox.addEventListener('change', function() {
                this.checked == true ? this.closest('tr').classList.add(highlightColorClass) : this.closest('tr').classList.remove(highlightColorClass);
            });
        });


        
        
        

        
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
        init: function() {
            _componentTableInbox();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    MailList.init();
});
