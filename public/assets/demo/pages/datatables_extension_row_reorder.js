





const DatatableRowReorder = function() {


    
    
    

    
    const _componentDatatableRowReorder = function() {
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


        
        $('.datatable-row-basic').DataTable({
            rowReorder: true
        });


        
        $('.datatable-row-full').DataTable({
            rowReorder: {
                selector: 'tr'
            },
            columnDefs: [
                {
                    targets: 0,
                    visible: false
                },
                {
                    orderable: false,
                    width: 100,
                    targets: [ 5 ]
                }
            ]
        });


        
        $('.datatable-row-responsive').DataTable({
            rowReorder: {
                selector: 'td:nth-child(2)'
            },
            responsive: true
        });


        
        const table = $('.datatable-row-events').DataTable({
            rowReorder: true
        });
     
        
        table.on('row-reorder', function (e, diff, edit) {
            let result = 'Reorder started on row: '+edit.triggerRow.data()[1]+'<br>';
     
            for (let i=0, ien=diff.length ; i<ien ; i++) {
                const rowData = table.row( diff[i].node ).data();
     
                result += rowData[1]+' updated to be in position '+
                    diff[i].newData+' (was '+diff[i].oldData+')<br>';
            }
     
            $('#event-result').html('Event result:<br>'+result);
        });
    };


    
    
    

    return {
        init: function() {
            _componentDatatableRowReorder();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DatatableRowReorder.init();
});
