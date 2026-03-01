





const DatatableKeyTable = function() {


    
    
    

    
    const _componentDatatableKeyTable = function() {
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


        
        $('.datatable-key-basic').DataTable({
            keys: true
        });


        
        $('.datatable-key-scroll').DataTable({
            dom: '<"datatable-header info-right"fi><"datatable-scroll-wrap"t>',
            scrollY: 300,
            paging: false,
            keys: true
        });
     

        
        $('.datatable-key-class').DataTable({
            keys: {
                className: 'focus focus-success'
            }
        });


        
        const table = $('.datatable-key-events').DataTable({
            keys: true
        });
     
        
        const events = $('#key-events');
        table
            .on('key', function (e, datatable, key, cell, originalEvent) {
                events.append(JSON.stringify('Key press: '+key+' for cell '+cell.data()), '\n');
            })
            .on('key-focus', function (e, datatable, cell) {
                events.append(JSON.stringify('Cell focus: '+cell.data()), '\n');
            })
            .on('key-blur', function (e, datatable, cell) {
                events.append(JSON.stringify('Cell blur: '+cell.data()), '\n');
            });
    };


    
    
    

    return {
        init: function() {
            _componentDatatableKeyTable();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DatatableKeyTable.init();
});
