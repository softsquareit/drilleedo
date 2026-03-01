





const GridJsCustomizing = function() {


    
    
    

    
    const _componentGridJsCustomization = function() {
        if (typeof gridjs == 'undefined') {
            console.warn('Warning - gridjs.min.js is not loaded.');
            return;
        }

        
        const demoData = [
            ["John", "john@example.com", "(353) 01 222 3333", "Netherlands"],
            ["Mark", "mark@gmail.com", "(01) 22 888 4444", "Switzerland"],
            ["Eoin", "eoin@gmail.com", "0097 22 654 00033", "Germany"],
            ["Sarah", "sarahcdd@gmail.com", "+322 876 1233", "France"],
            ["Afshin", "afshin@mail.com", "(353) 22 87 8356", "Norway"]
        ];


        
        const gridjsCellFormattingElement = document.querySelector(".gridjs-example-cell-formatting");
        if(gridjsCellFormattingElement) {
            const gridjsCellFormatting = new gridjs.Grid({
                className: {
                    table: 'table'
                },
                sort: true,
                columns: [
                    { 
                        name: 'Name',
                        formatter: (cell) => gridjs.html(`<span class="fw-semibold">Name:</span> ${cell}`)
                    },
                    "Email",
                    "Phone Number",
                    "Country"
                ],
                data: demoData
            });
            gridjsCellFormatting.render(gridjsCellFormattingElement);
        }

        
        const gridjsCellAttributesElement = document.querySelector(".gridjs-example-cell-attributes");
        if(gridjsCellAttributesElement) {
            const gridjsCellAttributes = new gridjs.Grid({
                className: {
                    table: 'table'
                },
                sort: true,
                columns: [
                    { 
                        name: 'Name',
                        attributes: {
                            'data-field':  'name',
                            'class': 'gridjs-th gridjs-th-sort text-danger'
                        }
                    },
                    "Email",
                    "Phone Number",
                    "Country"
                ],
                data: demoData
            });
            gridjsCellAttributes.render(gridjsCellAttributesElement);
        }

        
        const gridjsRowButtonsElement = document.querySelector(".gridjs-example-row-buttons");
        if(gridjsRowButtonsElement) {
            const gridjsRowButtons = new gridjs.Grid({
                className: {
                    table: 'table'
                },
                sort: true,
                columns: [
                    "Name",
                    "Email",
                    "Phone Number",
                    "Country",
                    { 
                        name: 'Actions',
                        sort: false,
                        width: 50,  
                        formatter: (cell, row) => {
                            return gridjs.h('button', {
                                className: 'btn btn-light btn-sm btn-icon',
                                onClick: () => alert(`Editing "${row.cells[0].data}" "${row.cells[1].data}"`)
                            }, gridjs.html('<i class="ph-pencil"></i>'));
                        }
                    }
                ],
                data: demoData
            });
            gridjsRowButtons.render(gridjsRowButtonsElement);
        }

        
        const gridjsCellHTMLElement = document.querySelector(".gridjs-example-cell-html");
        if(gridjsCellHTMLElement) {
            const gridjsCellHTML = new gridjs.Grid({
                className: {
                    table: 'table'
                },
                sort: true,
                columns: [
                    { 
                        name: 'Name',
                        formatter: (cell) => gridjs.html(`<strong>${cell}</strong>`)
                    },
                    "Email",
                    "Phone Number",
                    "Country",
                    { 
                        name: 'Actions',
                        sort: false,
                        width: 140,
                        formatter: (_, row) => gridjs.html(`<a href='mailto:${row.cells[1].data}'><i class="ph-envelope me-1"></i> Email</a>`)
                    }
                ],
                data: demoData
            });
            gridjsCellHTML.render(gridjsCellHTMLElement);
        }

        
        const gridjsHeaderHTMLElement = document.querySelector(".gridjs-example-header-html");
        if(gridjsHeaderHTMLElement) {
            const gridjsHeaderHTML = new gridjs.Grid({
                className: {
                    table: 'table'
                },
                sort: true,
                columns: [
                    {
                        id: 'name',
                        name: gridjs.html(`<i class="ph-user me-2"></i> Name`)
                    },
                    { 
                        id: 'email',
                        name: gridjs.html(`<i class="ph-envelope me-2"></i> Email`)
                    },
                    { 
                        id: 'phoneNumber',
                        name: gridjs.html(`<i class="ph-phone me-2"></i> Phone Number`)
                    },
                    { 
                        id: 'country',
                        name: gridjs.html(`<i class="ph-globe me-2"></i> Country`)
                    }
                ],
                data: demoData
            });
            gridjsHeaderHTML.render(gridjsHeaderHTMLElement);
        }
    };


    
    
    

    return {
        init: function() {
            _componentGridJsCustomization();
        }
    }
}();





document.addEventListener('DOMContentLoaded', function() {
    GridJsCustomizing.init();
});
