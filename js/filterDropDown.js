/**
 * filterDropDown.js
 *
 * Copyright (C) 2017-24 Erik Kalkoken
 *
 * Extension for the jQuery plug-in DataTables (developed and tested with v1.13.7)
 *
 * Version 0.5.0
 **/
(($) => {
    "use strict";

    /**
     * Parse initialization array and returns filterDef array to faster and easy use,
     * also sets defaults for properties that are not set
     *
     * @param initArray
     * @returns {{autoSize: boolean, bootstrap_version: number, columnsIdxList: *[], columns: *[], bootstrap: boolean, label: string, ajax: null}}
     */
    const parseInitArray = (initArray) => {
        /**
         * Default filter definition
         *
         * @type {{autoSize: boolean, bootstrap_version: number, columnsIdxList: *[], columns: *[], bootstrap: boolean, label: string, ajax: null}}
         */
        const filterDef = {
            columns: [],
            columnsIdxList: [],
            bootstrap: false,
            bootstrap_version: 3,
            autoSize: true,
            ajax: null,
            label: "Filter ",
        };

        // Set filter properties if they have been defined otherwise the defaults will be used
        if (
            "bootstrap" in initArray &&
            typeof initArray.bootstrap === "boolean"
        ) {
            filterDef.bootstrap = initArray.bootstrap;
        }

        if (
            "bootstrap_version" in initArray &&
            typeof initArray.bootstrap_version === "number"
        ) {
            filterDef.bootstrap_version = initArray.bootstrap_version;
        }

        if (
            "autoSize" in initArray &&
            typeof initArray.autoSize === "boolean"
        ) {
            filterDef.autoSize = initArray.autoSize;
        }

        if ("ajax" in initArray && typeof initArray.ajax === "string") {
            filterDef.ajax = initArray.ajax;
        }

        if ("label" in initArray && typeof initArray.label === "string") {
            filterDef.label = initArray.label;
        }

        // Add definition for each column
        if ("columns" in initArray) {
            initArray.columns.forEach((initColumn) => {
                if ("idx" in initColumn && typeof initColumn.idx === "number") {
                    // Initialize column
                    const idx = initColumn.idx;

                    filterDef.columns[idx] = {
                        title: null,
                        maxWidth: null,
                        autoSize: true,
                    };

                    // Add to a list of indices in the same order they appear in the init array
                    filterDef.columnsIdxList.push(idx);

                    // Set column properties if they have been defined otherwise the defaults will be used
                    if (
                        "title" in initColumn &&
                        typeof initColumn.title === "string"
                    ) {
                        filterDef.columns[idx].title = initColumn.title;
                    }

                    if (
                        "maxWidth" in initColumn &&
                        typeof initColumn.maxWidth === "string"
                    ) {
                        filterDef.columns[idx].maxWidth = initColumn.maxWidth;
                    }

                    if (
                        "autoSize" in initColumn &&
                        typeof initColumn.autoSize === "boolean"
                    ) {
                        filterDef.columns[idx].autoSize = initColumn.autoSize;
                    }
                }
            });
        }

        return filterDef;
    };

    /**
     * Add option d to the given select object
     *
     * @param select
     * @param d
     */
    const addOption = (select, d) => {
        if (d !== "") {
            select.append(`<option value="${d}">${d}</option>`);
        }
    };

    /**
     * Initialize the select element for given column and apply event to react to changes
     *
     * @param id
     * @param column
     * @returns {*|jQuery|HTMLElement}
     */
    const initSelectForColumn = (id, column) => {
        const select = $(`#${id}_filterSelect${column.index()}`);

        $(select).change(() => {
            const val = $.fn.dataTable.util.escapeRegex($(select).val());

            column.search(val ? `^${val}$` : "", true, false).draw();
        });

        return select;
    };

    // Add filterDropDown container div, draw select elements with default options.
    // Use preInit so that elements are created and correctly shown before data is loaded
    $(document).on("preInit.dt", (e, settings) => {
        if (e.namespace !== "dt") {
            return;
        }

        // Get the api object for the current dt table
        const api = new $.fn.dataTable.Api(settings);

        // Get the id of the current table
        const id = api.table().node().id;

        // Get the initialization object for the current table to retrieve custom settings
        const initObj = api.init();

        // Only proceed if the filter has been defined in the current table,
        // otherwise don't do anything.
        if (!("filterDropDown" in initObj)) {
            return;
        }

        // Get the current filter definition from the init array
        const filterDef = parseInitArray(initObj.filterDropDown);

        // only proceed if there are any columns defined
        if (filterDef.columns.length === 0) {
            return;
        }

        // Get container div for the current data table to add new elements to
        const container = api.table().container();

        // Add filter elements to DOM
        const filterWrapperId = `${id}_filterWrapper`;

        // Set CSS classes for the filter wrapper div depending on bootstrap setting
        let divCssClass = `${filterWrapperId} ${
            filterDef.bootstrap ? "form-inline" : ""
        }`;
        if (filterDef.bootstrap && filterDef.bootstrap_version === 5) {
            divCssClass = `${filterWrapperId} input-group my-3`;
        }

        $(container).prepend(
            `<div id="${filterWrapperId}" class="${divCssClass}"><span class="pt-2">${filterDef.label}</span></div>`
        );

        api.columns(filterDef.columnsIdxList).every(function () {
            const idx = this.index();

            // set title of current column
            let colName =
                filterDef.columns[idx].title !== null
                    ? filterDef.columns[idx].title
                    : $(this.header()).html();

            if (colName === "") {
                colName = `column ${idx + 1}`;
            }

            // Adding the select element for current column to container
            const selectId = `${id}_filterSelect${idx}`;

            // Set CSS classes for the select element depending on bootstrap setting
            let selectMarkup = `<select id="${selectId}" class="form-control ${id}_filterSelect"></select>`;
            if (filterDef.bootstrap && filterDef.bootstrap_version === 5) {
                selectMarkup = `<select id="${selectId}" class="form-select w-auto ms-2 ${id}_filterSelect"></select>`;
            }

            $("#" + filterWrapperId).append(selectMarkup);

            // Initializing select for current column and applying event to react to changes
            const select = $("#" + selectId)
                .empty()
                .append(`<option value="">(${colName})</option>`);

            // Set max width of select elements to current width (which is defined by the size of the title)
            // Turn off on for very small screens for responsive design, or if autoSize has been set to false
            if (
                filterDef.autoSize &&
                filterDef.columns[idx].autoSize &&
                screen.width > 768
            ) {
                select.css("max-width", select.outerWidth());
            }

            // Apply optional css style if defined in the init array will override automatic max width setting
            if (filterDef.columns[idx].maxWidth !== null) {
                select.css("max-width", filterDef.columns[idx].maxWidth);
            }
        });
    });

    // Filter table and add available options to dropDowns
    $(document).on("init.dt", (e, settings) => {
        if (e.namespace !== "dt") {
            return;
        }

        // Get api object for current dt table
        const api = new $.fn.dataTable.Api(settings);

        // Get id of current table
        const id = api.table().node().id;

        // Get the initialization object for current table to retrieve custom settings
        const initObj = api.init();

        // Only proceed if a filter has been defined in the current table, otherwise don't do anything.
        if (!("filterDropDown" in initObj)) {
            return;
        }

        // Get current filter definition
        const filterDef = parseInitArray(initObj.filterDropDown);

        if (filterDef.ajax == null) {
            api.columns(filterDef.columnsIdxList).every(function () {
                const column = this;
                const select = initSelectForColumn(id, column);

                column
                    .data()
                    .unique()
                    .sort()
                    .each((d) => {
                        addOption(select, d);
                    });
            });
        } else {
            // Fetch column options from server for server side processing
            const columnsQuery = `columns=${encodeURIComponent(
                api.columns(filterDef.columnsIdxList).dataSrc().join()
            )}`;

            $.getJSON(`${filterDef.ajax}?${columnsQuery}`, (columnsOptions) => {
                api.columns(filterDef.columnsIdxList).every(function () {
                    const column = this;
                    const select = initSelectForColumn(id, column);
                    const columnName = column.dataSrc();

                    if (columnName in columnsOptions) {
                        columnsOptions[columnName].forEach((d) => {
                            addOption(select, d);
                        });
                    } else {
                        console.warn(
                            `Missing column '${columnName}' in ajax response.`
                        );
                    }
                });
            });
        }
    });
})(jQuery);
