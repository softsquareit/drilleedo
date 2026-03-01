





const DatatableFixedColumns = function() {


    
    
    

    
    const _componentDatatableFixedColumns = function() {
        if (!$().DataTable) {
            console.warn('Warning - datatables.min.js is not loaded.');
            return;
        }

        
        $.extend( $.fn.dataTable.defaults, {
            columnDefs: [{ 
                orderable: false,
                width: 100,
                targets: [ 5 ]
            }],
            dom: '<"datatable-header"fl><"datatable-scroll datatable-scroll-wrap"t><"datatable-footer"ip>',
            language: {
                search: '<span class="me-3">Filter:</span> <div class="form-control-feedback form-control-feedback-end flex-fill">_INPUT_<div class="form-control-feedback-icon"><i class="ph-magnifying-glass opacity-50"></i></div></div>',
                searchPlaceholder: 'Type to filter...',
                lengthMenu: '<span class="me-3">Show:</span> _MENU_',
                paginate: { 'first': 'First', 'last': 'Last', 'next': document.dir == "rtl" ? '&larr;' : '&rarr;', 'previous': document.dir == "rtl" ? '&rarr;' : '&larr;' }
            }
        });


        
        $('.datatable-fixed-left').DataTable({
            columnDefs: [
                { 
                    orderable: false,
                    targets: 5
                },
                { 
                    width: 200,
                    targets: 0
                },
                { 
                    width: 300,
                    targets: 1
                },
                { 
                    width: 200,
                    targets: [5, 6]
                },
                { 
                    width: 100,
                    targets: 4
                }
            ],
            scrollX: true,
            scrollY: 350,
            scrollCollapse: true,
            fixedColumns: true
        });


        
        $('.datatable-fixed-right').DataTable({
            columnDefs: [
                { 
                    orderable: false,
                    targets: 5
                },
                { 
                    width: 300,
                    targets: 0
                },
                { 
                    width: 300,
                    targets: 1
                },
                { 
                    width: 200,
                    targets: [5, 6]
                },
                { 
                    width: 100,
                    targets: [3, 4]
                }
            ],
            scrollX: true,
            scrollY: 350,
            scrollCollapse: true,
            fixedColumns: {
                leftColumns: 0,
                rightColumns: 1
            }
        });


        
        $('.datatable-fixed-both').DataTable({
            columnDefs: [
                { 
                    orderable: false,
                    targets: 5
                },
                { 
                    width: 200,
                    targets: 0
                },
                { 
                    width: 100,
                    targets: 1
                },
                { 
                    width: 200,
                    targets: [5, 6]
                },
                { 
                    width: 100,
                    targets: 4
                }
            ],
            scrollX: true,
            scrollY: 350,
            scrollCollapse: true,
            fixedColumns: {
                leftColumns: 1,
                rightColumns: 1
            }
        });


        
        
        
        
        
        const table = $('.datatable-fixed-complex').DataTable({
            autoWidth: false,
            columnDefs: [
                { 
                    orderable: false,
                    targets: 5
                },
                { 
                    width: 250,
                    targets: 0
                },
                { 
                    width: 250,
                    targets: 1
                },
                { 
                    width: 200,
                    targets: [5, 6]
                },
                { 
                    width: 100,
                    targets: 4
                }
            ],
            scrollX: true,
            scrollY: 350,
            scrollCollapse: true,
            fixedColumns: true
        });

        
        setTimeout(function() {
            $(window).on('resize', function () {
                table.columns.adjust();
            });
        }, 100);
    };


    
    
    

    return {
        init: function() {
            _componentDatatableFixedColumns();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    DatatableFixedColumns.init();
});
