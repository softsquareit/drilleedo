/*********************************************************************************
 * @module DatatablesConfig
 * Datatables Configuration and Initializer
 * This script initializes and configures DataTables for tables in the application.
 *********************************************************************************/
window.DatatablesConfig = function () {
    /**
     * A constant string to serve as the prefix for DataTable css classes to trigger the creation
     * @constant {string}
     */
    const PREFIX = "creancial"
    /**
     * The CSS class marker for identifying tables that should be transformed into DataTables.
     * @constant {string}
     */
    const DATATABLE_MARKER = `${PREFIX}-data-table`;
    /**
     * The jQuery-compatible selector string for the DataTable marker.
     * @constant {string}
     */
    const DATATABLE_MARKER_SELECTOR = `.${DATATABLE_MARKER}`;
    /**
     * The CSS class marker for identifying DataTables with column-based search functionality.
     * @constant {string}
     */
    const DATATABLE_COLUMN_SEARCH = `${DATATABLE_MARKER}-column-search`;
    /**
     * The CSS class marker for identifying DataTables with cell hover functionality.
     * @constant {string}
     */
    const DATATABLE_CELL_HOVER = `${DATATABLE_MARKER}-cell-hover`;
    /**
     * The CSS class marker for identifying DataTables with column visibility toggle functionality.
     * @constant {string}
     */
    const DATATABLE_COLUMNS_VISIBILITY = `${DATATABLE_MARKER}-columns-visibility`;
    /**
     * The CSS class marker for identifying DataTables with HTML5 export buttons (e.g., Excel, CSV, Print).
     * @constant {string}
     */
    const DATATABLE_HTML5_BUTTONS = `${DATATABLE_MARKER}-html5-buttons`;
    /**
     * The CSS class marker for identifying DataTables with HTML5 export buttons (e.g., Excel, CSV, Print).
     * @constant {string}
     */
    const DATATABLE_SELECT_CHECKBOX = `${DATATABLE_MARKER}-select-checkbox`;
    /**
     * The CSS class marker for identifying DataTables with archive filtering functionality.
     * @constant {string}
     */
    const DATATABLE_ARCHIVE_FILTER = `${DATATABLE_MARKER}-archive-filter`;
    /**
     * The CSS class marker for identifying DataTables with manual client side rendering.
     * @constant {string}
     */
    const DATATABLE_CLIENT_SIDE = `${DATATABLE_MARKER}-client-side`;

    /**
     * An object that stores DataTables configuration overrides.
     * This allows for specific configuration overrides for specific tables.
     * The keys are table IDs, and the values are the overriding configurations.
     *
     * @type {Object<string, Object>}
     */
    const datatablesOptionsToOverride = {};

    /**
     * An object that stores the final DataTables configuration options.
     * The keys are table IDs, and the values are the final configurations options.
     *
     * @type {Object<string, Object>}
     */
    const datatablesOptions = {};

    /**
     * An object that stores API references to initialized DataTable instances.
     *
     * The object is keyed by the DataTable instance's ID attribute, making it easy to retrieve and manipulate
     * specific table instances programmatically. This can be especially useful for complex applications where multiple
     * DataTable instances exist and may need to be accessed or modified dynamically.
     *
     * @example
     * 1. Initialize a DataTable with ID 'myTable'.
     * 2. Retrieve its API: const api = getDatatableApi('myTable');
     * 3. Use the API: api.search('some_value').draw();
     *
     * @type {Object<string, any>}
     */
    const datatablesApis = {};

    /**
     * An object for managing callback functions that respond to DataTables events.
     *
     * This object is designed to facilitate the organization and execution of callback functions in response
     * to DataTables events. Events are associated with specific DataTable instances, and each event type can
     * have multiple callback functions.
     *
     * @example
     * 1. Register a callback for the 'custom' event of a DataTable with ID 'myTable':
     *    addEventListener('myTable', 'custom', function(args) {
     *        console.log('Table redrawn');
     *    });
     * 2. Initialize the DataTable instance.
     * 3. The registered callback will be executed every time the table is redrawn.
     *
     * @type {Object<string, Object<string, Function[]>>}
     */
    const datatablesEvents = {};

    /**
     * @function
     * Override DataTables configuration options for a specific table.
     *
     * This function allows you to dynamically change the configuration of a DataTable
     * by updating the `datatablesOptionsToOverride` object.
     *
     * @example
     * overrideDatatableOptions('exampleTable', {
     *     paging: false,
     *     search: false,
     * });
     *
     * @param {string} tableId - The unique ID associated with the table to be customized.
     * @param {Object} options - An object containing the DataTable configuration options to be overridden.
     */
    const overrideDatatableOptions = (tableId, options) => {
        datatablesOptionsToOverride[tableId] = options;
    }

    /**
     * @function
     * Get final DataTables configuration options for a specific table.
     *
     * @example
     * getDatatableOptions('exampleTable');
     *
     * @param {string} tableId - The unique ID associated with the table.
     */
    const getDatatableOptions = (tableId) => {
        return datatablesOptions[tableId] ?? null;
    }

    /**
     * @function
     * Add final DataTables configuration options for a specific table.
     *
     * @example
     * addDatatableOptions('exampleTable', options);
     *
     * @param {string} tableId - The unique ID associated with the table.
     * @param {Object} options - An object containing the DataTable configuration options.
     */
    const addDatatableOptions = (tableId, options) => {
        datatablesOptions[tableId] = options;
    }

    /**
     * @function
     * Retrieves any custom configuration overrides that have been set for a specific DataTable.
     *
     * This function looks up the `datatablesOptionsToOverride` object to find if any custom
     * configurations have been provided for a DataTable identified by `tableId`.
     *
     * @example
     * // Suppose datatablesOptionsToOverride is { 'table1': { paging: false } }
     * const options = getOptionsToOverride('table1');
     * // options will be { paging: false }
     *
     * @param {string} tableId - The unique identifier (ID) for the table whose options are to be retrieved.
     * @returns {Object} An object containing the overridden options for the specified table, empty object if there is nothing
     */
    const getOptionsToOverride = (tableId) => {
        return datatablesOptionsToOverride[tableId] ?? {};
    }

    /**
     * @function
     * Registers the DataTable API object for a table by its unique ID.
     *
     * @param {string} tableId - The unique identifier (ID) for the table.
     * @param {any} api
     */
    const addDatatableApi = (tableId, api) => {
        datatablesApis[tableId] = api;
    }

    /**
     * @function
     * Retrieve the DataTable API instance for a given table using its unique ID.
     *
     * This function looks up the `datatablesApis` object to find the DataTable API
     * associated with the specified `tableId`. It returns the API instance if found;
     * otherwise, it returns `null`.
     *
     * @example
     * const api = getDatatableApi('exampleTable');
     *
     * @param {string} tableId - The unique ID associated with the table for which the API is to be retrieved.
     * @return {any|null} - Returns the DataTable API instance for the specified table if found; otherwise returns null.
     */
    const getDatatableApi = (tableId) => {
        return datatablesApis[tableId] ?? null;
    }

    /**
     * @function private
     * Registers event handlers for a specified DOM element with a given event name.
     *
     * @param {string} tableId - The ID of the target DOM element to attach the event handler to.
     * @param {string} eventName - The name of the event to register (e.g., 'click', 'change', etc.).
     */
    const registerEvents = (tableId, eventName) => {
        $(`#${tableId}`).on(eventName, function (...args) {
            const that = this;
            datatablesEvents[tableId][eventName].map(cb => cb.apply(that, args))
        });
    }

    /**
     * @function
     * Register a callback function for one or more DataTable events.
     *
     * @param {string} tableId - The ID of the DataTable instance.
     * @param {string} events - The names of the events to listen for, separated by white space (e.g., 'draw.dt customEvent').
     * @param {Function} callback - The callback function to execute when the events occur.
     * @returns {void}
     */
    const addEventListener = (tableId, events, callback) => {
        if (!datatablesEvents[tableId]) {
            datatablesEvents[tableId] = {};
        }

        // Split the events string by any amount of white space
        const eventNames = events.split(/\s+/);

        eventNames.forEach((eventName) => {
            if (!datatablesEvents[tableId][eventName]) {
                datatablesEvents[tableId][eventName] = [];

                // Check if the element with the given tableId is a DataTable.
                // If it is, the event handler is added after DOM load, so we need to register it manually.
                // If it's not, the handlers will be registered before DataTables creation.
                if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
                    registerEvents(tableId, eventName);
                }
            }
            datatablesEvents[tableId][eventName].push(callback);
        });
    }


    /**
     * Trigger an event for a specific table ID, handling DataTables events separately.
     *
     *
     * @param {string} tableId - The ID of the DataTable instance.
     * @param {string} eventName - The name of the event to trigger.
     * @param {...any} args - Variable arguments that will be passed to the event callbacks.
     * @returns {void}
     *
     * @example
     * // Trigger a custom event for a DataTable with ID 'myTable' with arguments.
     * triggerEvent('myTable', 'customEvent', 'arg1-value', 'arg2-value');
     *
     * // Trigger a DataTables event for 'myTable' (event name ending with '.dt').
     * triggerEvent('myTable', 'draw.dt');
     */
    const triggerEvent = (tableId, eventName, ...args) => {
        if (eventName.endsWith('.dt')) {
            // Handle DataTables event differently (e.g., using DataTables event triggers)
            $(`#${tableId}`).DataTable().trigger(eventName, args);
        } else {
            // Handle custom event using jQuery's .trigger() method
            $(`#${tableId}`).trigger(eventName, args);
        }
    }

    /**
     * @function
     * Add a row to a DataTable by its ID.
     *
     * @param {string} tableId - The unique identifier (ID) for the DataTable.
     * @param {any} rowData - the data for the new row.
     * @returns {void}
     */
    const addRow = (tableId, rowData) => {
        const datatableApi = getDatatableApi(tableId);

        if (datatableApi) {
            datatableApi.row.add(rowData).draw();
            triggerEvent(tableId, "rowAdd", rowData);
        }
    };

    const activeFn = function (settings, data, dataIndex) {
        const api = getDatatableApi($(settings.nTable).attr('id'));
        var rowData = api.cell(dataIndex, 2).node();
        var spanText = $(rowData).find('span').text();

        return !spanText.includes('Annulé') && !spanText.includes('Archivé');
    }

    const cancelFn = function (settings, data, dataIndex) {
        const api = getDatatableApi($(settings.nTable).attr('id'));
        var rowData = api.cell(dataIndex, 2).node();
        var spanText = $(rowData).find('span').text();

        return spanText.includes('Annulé');
    }

    const archiveFn = function (settings, data, dataIndex) {
        const api = getDatatableApi($(settings.nTable).attr('id'));
        var rowData = api.cell(dataIndex, 2).node();
        var spanText = $(rowData).find('span').text();

        return spanText.includes('Archivé');
    }

    const allFn = () => true;

    /**
     * Object to hold all filter functions
     */
    const filters = {
        /**
         * Function to show only active entries by filtering on 'archive == false'.
         * @param {string} tableId - The DataTables ID.
         */
        showActive: function (tableId) {
            const api = DatatablesConfig.getDatatableApi(tableId);
            if (api) {
                api.filter.push(activeFn, true);
                api.filter.remove(cancelFn);
                api.filter.remove(archiveFn);
                api.filter.remove(allFn);
                $(".filter-button").text("Actif");
            }
        },

        /**
         * Function to show only active entries by filtering on 'archive == false'.
         * @param {string} tableId - The DataTables ID.
         */
        showCanceled: function (tableId) {
            const api = DatatablesConfig.getDatatableApi(tableId);
            if (api) {
                api.filter.remove(activeFn);
                api.filter.push(cancelFn, true);
                api.filter.remove(archiveFn);
                api.filter.remove(allFn);
                $(".filter-button").text("Annulé");
            }
        },

        /**
         * Function to show only archived entries by filtering on 'archive == true'.
         * @param {string} tableId - The DataTables ID.
         */
        showArchive: function (tableId) {
            const api = DatatablesConfig.getDatatableApi(tableId);
            if (api) {
                api.filter.remove(activeFn);
                api.filter.remove(cancelFn);
                api.filter.push(archiveFn, true);
                api.filter.remove(allFn);
                $(".filter-button").text("Archivé")
            }
        },

        /**
         * Function to show all entries by clearing any custom filtering.
         * @param {string} tableId - The DataTables ID.
         */
        showAll: function (tableId) {
            const api = DatatablesConfig.getDatatableApi(tableId);
            if (api) {
                api.filter.remove(activeFn);
                api.filter.remove(cancelFn);
                api.filter.remove(archiveFn);
                api.filter.push(allFn, true);
                $(".filter-button").text("Tous")
            }
        },
    };

    /**
     * @function
     * Initializes and configures a DataTable for a given HTML table element.
     *
     * This function is responsible for:
     * - Parsing table-specific configuration options from data attributes.
     * - Merging those with default and custom options.
     * - Applying specific behaviors based on additional class markers.
     * - Initializing the DataTable.
     *
     * @param {Object} datatable - The jQuery element containing the table.
     *
     * @example
     * const myTableElement = $('#myTable');
     * createDatatable(myTableElement);
     *
     */
    const createDatatable = function (datatable) {
        // Generates a unique ID for the DataTable if none is provided
        const tableId = datatable.attr("id") ?? PREFIX + Math.random().toString(36).substr(2, 16);

        // Retrieve DataTable options from the table's data attributes.
        const dataAttributeOptions = datatable.attr("data-datatable-options");
        // Parse JSON string to JavaScript object.
        const optionsFromServer = dataAttributeOptions ? JSON.parse(dataAttributeOptions) : {};
        // Retrieve column settings for raw HTML content.
        const dataAttributeColumnsWithRawHtml = datatable.attr("data-raw-html-columns");
        let columnsWithRawHtml = [];
        if (dataAttributeColumnsWithRawHtml === "*") {
            columnsWithRawHtml = "_all";
        } else {
            columnsWithRawHtml = dataAttributeColumnsWithRawHtml ? JSON.parse(dataAttributeColumnsWithRawHtml) : [];
        }

        // Default DataTable options
        const defaultOptions = {
            autoWidth: false,
            orderCellsTop: true,
            columnDefs: [{
                render: data => data,
                targets: columnsWithRawHtml
            }],
            order: [[ 0, 'desc' ]],
            dom: '<"datatable-header justify-content-start"f<"ms-sm-auto"l><"ms-sm-3"B>><"datatable-scroll-wrap"t><"datatable-footer"ip>',
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Afficher tout"]],
            language: {
                url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json",
                search: '<span class="me-3">Filtre:</span> <div class="form-control-feedback form-control-feedback-end flex-fill">_INPUT_<div class="form-control-feedback-icon"><i class="ph-magnifying-glass opacity-50"></i></div></div>',
                searchPlaceholder: 'Chercher',
                lengthMenu: '<span class="me-2">Afficher</span> _MENU_ <span class="ms-2">entrées</span>',
                paginate: {'next': '&rarr;', 'previous': '&larr;'},
            },
        };

        // Retrieve table-specific override options
        const optionsToOverride = getOptionsToOverride(tableId);

        // Merge all option sets: defaults, server-defined, and overrides.
        const options = {
            ...defaultOptions,
            ...optionsFromServer,
            ...optionsToOverride
        };

        // Apply special rendering for columns with raw HTML
        options.columnDefs = [
            // this object should be on top (top priority) to render data as HTML with specified columns
            {
                render: data => data,
                targets: columnsWithRawHtml
            },
            ...(options.columnDefs ?? []),
            ...defaultOptions.columnDefs,
        ];


        // Add column search functionality if the table has the relevant class
        if (datatable.hasClass(DATATABLE_COLUMN_SEARCH)) {
            // Add a callback to be executed after DataTable initialization.
            // This callback adds a search input for each column in the table header.
            addEventListener(tableId, "init.dt", function () {
                // Create a new tr element for the column search inputs.
                const searchTheadRow = $("<tr></tr>");
                const thead = datatable.find("thead");
                // For each column, create a <th> containing an input field for searching.
                datatable.find("thead tr th").each(function () {
                    const title = $(this).text();
                    searchTheadRow.append($('<th><input type="text" class="form-control" placeholder="Chercher ' + title + '" /></th>'));
                });
                // Add the new <tr> to the table header.
                thead.append(searchTheadRow);
                // the table is filtered based on the input's value.
                $(this)
                    .dataTable()
                    .api()
                    .columns()
                    .every(function () {
                        const that = this;
                        searchTheadRow.find("input").on('keyup change clear', function () {
                            if (that.search() !== this.value) {
                                that.column($(this).parent().index() + ':visible').search(this.value).draw();
                            }
                        });
                    });
            })
        }

        // Add cell hover functionality if the table has the relevant class
        if (datatable.hasClass(DATATABLE_CELL_HOVER)) {
            // Add a callback to be executed after DataTable initialization.
            // This callback adds a 'mouseover' and 'mouseleave' event to the table body.
            addEventListener(tableId, "init.dt", function () {
                const api = DatatablesConfig.getDatatableApi(tableId);
                const lastIdx = null;
                if (api) {
                    datatable.find("tbody").on('mouseover', 'td', function () {
                        const colIdx = api.cell(this).index().column;

                        if (colIdx !== lastIdx) {
                            $(api.cells().nodes()).removeClass('active');
                            $(api.column(colIdx).nodes()).addClass('active');
                        }
                    }).on('mouseleave', function () {
                        $(api.cells().nodes()).removeClass('active');
                    });
                }
            });
        }

        // Add archive filter functionality if the table has the relevant class
        if (datatable.hasClass(DATATABLE_ARCHIVE_FILTER)) {
            // Call showActive on table initialization To show only active entries
            addEventListener(tableId, "init.dt rowAdd", function () {
                filters.showActive(tableId);
            });

            // Define buttons for archive filter
            options.buttons = [
                {
                    extend: 'collection',
                    text: 'Actif',
                    className: 'btn btn-primary btn-icon dropdown-toggle filter-button',
                    buttons: [
                        {
                            text: 'Actif',
                            action: () => filters.showActive(tableId)
                        },
                        {
                            text: 'Annulé',
                            action: () => filters.showCanceled(tableId)
                        },
                        {
                            text: 'Archivé',
                            action: () => filters.showArchive(tableId)
                        },
                        {
                            text: 'Tous',
                            action: () => filters.showAll(tableId)
                        }
                    ]
                },
                ...(options.buttons ?? []),
            ];
        }

        // Add export buttons if the table has the relevant class
        if (datatable.hasClass(DATATABLE_HTML5_BUTTONS)) {
            // Add export buttons like Copy, Excel, CSV, Print
            options.buttons = [
                ...(options.buttons ?? []),
                {
                    extend: 'copyHtml5',
                    className: 'btn btn-light',
                    text: '<i class="ph-duotone ph-copy" title="Copier"></i>',
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    extend: 'excelHtml5',
                    className: 'btn btn-light',
                    text: '<i class="ph-duotone ph-file-xls" title="Excel"></i>',
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    extend: 'csvHtml5',
                    className: 'btn btn-light',
                    text: '<i class="ph-duotone ph-file-csv" title="CSV"></i>',
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    extend: 'print',
                    className: 'btn btn-light',
                    text: '<i class="ph-duotone ph-printer" title="Imprimer"></i>',
                    exportOptions: {
                        columns: ':visible'
                    }
                }
            ];
        }

        // Add select checkbox if the table has the relevant class
        if (datatable.hasClass(DATATABLE_SELECT_CHECKBOX)) {
            options.order = [[ 1, "desc"]],
            options.columnDefs = [
                ...(options.columnDefs ?? []),
                {
                    orderable : false,
                    className : 'select-checkbox',
                    targets : 0
                },
            ]
            options.select = {
                style: 'multi',
                selector: 'td:first-child'
            },
            options.buttons = [
                {
                    extend: 'selectAll',
                    text: 'Séléctionner tout',
                    className: 'btn btn-primary'
                },
                {
                    extend: 'selectNone',
                    text: 'Désélectionner',
                    className: 'btn btn-primary'
                },
                ...(options.buttons ?? [])
            ]
        }

        // Add column visibility toggle if the table has the relevant class
        if (datatable.hasClass(DATATABLE_COLUMNS_VISIBILITY)) {
            // Add column visibility toggle button
            options.buttons = [
                ...(options.buttons ?? []),
                {
                    extend: 'colvis',
                    text: '<i class="ph-squares-four"></i>',
                    className: 'btn btn-teal btn-icon dropdown-toggle',
                }
            ];

            // If the table also has DATATABLE_COLUMN_SEARCH, hide or show the filter input based on column visibility
            if (datatable.hasClass(DATATABLE_COLUMN_SEARCH)) {
                addEventListener(tableId, 'column-visibility.dt', function (settings, column, state) {
                    const filterInput = $(`thead tr:eq(1) th:eq(${column})`);
                    if (state === false) {
                        filterInput.hide();
                    } else {
                        filterInput.show();
                    }
                });
            }
        }

        // Hide the loading spinner
        addEventListener(tableId, "init.dt", function () {
            $(`#datatable-spinner-${tableId}`).addClass("d-none")
        });

        // Register event handlers for DataTables events before Datatables creation.
        $.each(datatablesEvents[tableId], function (eventName) {
            registerEvents(tableId, eventName);
        });

        // Register the final configuration options
        addDatatableOptions(tableId, {...options});

        // Initialize the DataTable with the final options
        const api = datatable.DataTable(options);

        // Store the API for later access
        addDatatableApi(tableId, api);
    }

    /**
     * @function
     * Initializes and configures DataTables for all HTML tables that contain the DATATABLE_MARKER class.
     *
     * This function scans the DOM for any tables marked with the class corresponding to DATATABLE_MARKER,
     * and initializes each one as a DataTable.
     *
     * @example
     * $(document).ready(initDatatablesConfig);
     *
     * @throws {Error} Will throw an error if the DataTables library is not loaded.
     */
    const initDatatablesConfig = function () {
        // Check if DataTables is loaded
        if (!$().DataTable) {
            console.error('Error - datatables is not loaded.');
            return;
        }

        $.fn.dataTable.Api.register('filter.push', function (fn, draw) {
            if (!this._filters) {
                this._filters = [];
            }

            this._filters.push(fn);

            const temp = $.fn.dataTable.ext.search;

            $.fn.dataTable.ext.search = this._filters;

            if (draw) {
                this.draw();
            }

            $.fn.dataTable.ext.search = temp;
        });

        $.fn.dataTable.Api.register('filter.pop', function (draw) {
            if (!this._filters) {
                this._filters = [];
            }

            this._filters.pop();

            const temp = $.fn.dataTable.ext.search;

            $.fn.dataTable.ext.search = this._filters;

            if (draw) {
                this.draw();
            }
            $.fn.dataTable.ext.search = temp;
        });

        $.fn.dataTable.Api.register('filter.remove', function (fn, draw) {
            if (!this._filters) {
                this._filters = [];
            }

            this._filters.splice(this._filters.indexOf(fn), 1);

            const temp = $.fn.dataTable.ext.search;

            $.fn.dataTable.ext.search = this._filters;

            if (draw) {
                this.draw();
            }

            $.fn.dataTable.ext.search = temp;
        });

        // For each table with class "DATATABLE_MARKER", initialize DataTables
        $(DATATABLE_MARKER_SELECTOR).each(function () {
            const datatable = $(this);
            if (!datatable.hasClass(DATATABLE_CLIENT_SIDE)) {
                createDatatable($(this));
            }
        });
    }

    $(document).ready(initDatatablesConfig);

    return {
        addEventListener,
        createDatatable,
        triggerEvent,
        addRow,
        overrideDatatableOptions,
        getDatatableApi,
        getDatatableOptions,
        filters
    }
}();