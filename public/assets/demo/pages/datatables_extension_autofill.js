





const DatatableAutofill = function() {


    
    
    

    
    const _componentDatatableAutofill = function() {
        if (!$().DataTable) {
            console.warn('Warning - datatables.min.js is not loaded.');
            return;
        }

        
        $.extend( $.fn.dataTable.defaults, {
            autoWidth: false,
            columnDefs: [{ 
                orderable: false,
                width: 100,
                targets: [ 5 ]
            }],
            dom: '<"datatable-header"fl><"datatable-scroll-wrap"t><"datatable-footer"ip>',
            language: {
                search: '<span class="me-3">Filter:</span> <div class="form-control-feedback form-control-feedback-end flex-fill">_INPUT_<div class="form-control-feedback-icon"><i class="ph-magnifying-glass opacity-50"></i></div></div>',
                searchPlaceholder: 'Type to filter...',
                lengthMenu: '<span class="me-3">Show:</span> _MENU_',
                paginate: { 'first': 'First', 'last': 'Last', 'next': document.dir == "rtl" ? '&larr;' : '&rarr;', 'previous': document.dir == "rtl" ? '&rarr;' : '&larr;' }
            }
        });


        
        $('.datatable-autofill-basic').DataTable({
            autoFill: true
        });


        
        $('.datatable-autofill-confirm').DataTable({
            autoFill: {
                alwaysAsk: true
            },
        });


        
        $('.datatable-autofill-click').DataTable({
            autoFill: {
                focus: 'click'
            }
        });


        
        $('.datatable-autofill-column').DataTable( {
            columnDefs: [
                {
                    orderable: false,
                    className: 'select-checkbox',
                    targets: 0
                },
                {
                    orderable: false,
                    width: 100,
                    targets: 6
                }
            ],
            select: {
                style: 'os',
                selector: 'td:first-child'
            },
            order: [1, 'asc'],
            autoFill: {
                columns: ':not(:first-child):not(:last-child)'
            }
        });
    };


    
    
    

    return {
        init: function() {
            _componentDatatableAutofill();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DatatableAutofill.init();
});
