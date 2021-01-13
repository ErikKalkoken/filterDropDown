/*
 * filterDropDown.js
 *
 * Copyright (C) 2017-18 Erik Kalkoken
 *
 * Extension for the jQuery plug-in DataTables (developed and tested with v1.10.15)
 *
 * Version 0.4.0
 *
**/

(function ($) {

	// parse initialization array and returns filterDef array to faster and easy use
	// also sets defaults for properties that are not set
	function parseInitArray(initArray) {
		// initialization and setting defaults
		let filterDef = {
			"columns": [],
			"columnsIdxList": [],
			"bootstrap": false,
			"autoSize": true,
			"ajax": null,
			"label": "Filter "
		};

		// set filter properties if they have been defined
		// otherwise the defaults will be used
		if (("bootstrap" in initArray) && (typeof initArray.bootstrap === 'boolean')) {
			filterDef.bootstrap = initArray.bootstrap;
		}

		if (("autoSize" in initArray) && (typeof initArray.autoSize === 'boolean')) {
			filterDef.autoSize = initArray.autoSize;
		}

		if (("ajax" in initArray) && (typeof initArray.ajax === 'string')) {
			filterDef.ajax = initArray.ajax;
		}

		if (("label" in initArray) && (typeof initArray.label === 'string')) {
			filterDef.label = initArray.label;
		}

		// add definition for each column
		if ("columns" in initArray) {
			initArray.columns.forEach(function (initColumn) {
				if (("idx" in initColumn) && (typeof initColumn.idx === 'number')) {
					// initialize column
					let idx = initColumn.idx;
					filterDef['columns'][idx] = {
						"title": null,
						"maxWidth": null,
						"autoSize": true
					};

					// add to list of indices in same order they appear in the init array
					filterDef['columnsIdxList'].push(idx);

					// set column properties if they have been defined
					// otherwise the defaults will be used
					if (('title' in initColumn)
						&& (typeof initColumn.title === 'string')
					) {
						filterDef['columns'][idx].title = initColumn.title;
					}

					if (('maxWidth' in initColumn)
						&& (typeof initColumn.maxWidth === 'string')
					) {
						filterDef['columns'][idx].maxWidth = initColumn.maxWidth;
					}

					if (('autoSize' in initColumn)
						&& (typeof initColumn.autoSize === 'boolean')
					) {
						filterDef['columns'][idx].autoSize = initColumn.autoSize;
					}
				}
			});
		}
		return filterDef;
	}

	// Add option d to given select object
	function addOption(select, d) {
		if (d != "") {
			select.append('<option value="' + d + '">' + d + '</option>');
		}
	}

	// initalizing select for current column and applying event to react to changes
	function initSelectForColumn(id, column) {
		let select = $("#" + id + "_filterSelect" + column.index());
		select.on('change', function () {
			let val = $.fn.dataTable.util.escapeRegex($(this).val());
			column
				.search(val ? '^' + val + '$' : '', true, false)
				.draw();
		});
		return select
	}

	// Add filterDropDown container div, draw select elements with default options
	// use preInit so that elements are created and correctly shown before data is loaded
	$(document).on('preInit.dt', function (e, settings) {
		if (e.namespace !== 'dt') return;

		// get api object for current dt table
		var api = new $.fn.dataTable.Api(settings);

		// get id of current table
		var id = api.table().node().id;

		// get initialization object for current table to retrieve custom settings
		var initObj = api.init();

		// only proceed if filter has been defined in current table, otherwise don't do anything.
		if (!("filterDropDown" in initObj)) return;

		// get current filter definition from init array
		var filterDef = parseInitArray(initObj.filterDropDown);

		// only proceed if there are any columns defined
		if (filterDef.columns.length == 0) return;

		// get container div for current data table to add new elements to
		var container = api.table().container();

		// add filter elements to DOM
		var filterWrapperId = id + "_filterWrapper";
		var divCssClass = filterWrapperId + " " + (
			(filterDef.bootstrap)
				? "form-inline"
				: ""
		);
		$(container).prepend(
			'<div id="'
			+ filterWrapperId
			+ '" class="'
			+ divCssClass + '">'
			+ filterDef.label
			+ '</div>'
		);

		api.columns(filterDef.columnsIdxList).every(function () {
			let idx = this.index();

			// set title of current column
			let colName = (filterDef.columns[idx].title !== null)
				? filterDef.columns[idx].title
				: $(this.header()).html();

			if (colName == "") colName = 'column ' + (idx + 1);

			// adding select element for current column to container
			let selectId = id + "_filterSelect" + idx;
			$('#' + filterWrapperId).append(
				'<select id="'
				+ selectId
				+ '" class="form-control '
				+ id
				+ '_filterSelect"></select>'
			);

			// initalizing select for current column and applying event to react to changes
			let select = $("#" + selectId).empty()
				.append('<option value="">(' + colName + ')</option>');

			// set max width of select elements to current width (which is defined by the size of the title)
			// turn off on for very small screens for responsive design or if autoSize has been set to false
			if (filterDef.autoSize && filterDef.columns[idx].autoSize && (screen.width > 768)) {
				select.css('max-width', select.outerWidth());
			}

			// apply optional css style if defined in init array
			// will override automatic max width setting
			if (filterDef.columns[idx].maxWidth !== null) {
				select.css('max-width', filterDef.columns[idx].maxWidth);
			}
		});

	});

	// filter table and add available options to dropDowns
	$(document).on('init.dt', function (e, settings) {
		if (e.namespace !== 'dt') return;

		// get api object for current dt table
		var api = new $.fn.dataTable.Api(settings);

		// get id of current table
		var id = api.table().node().id;

		// get initialization object for current table to retrieve custom settings
		var initObj = api.init();

		// only proceed if filter has been defined in current table, otherwise don't do anything.
		if (!("filterDropDown" in initObj)) return;

		// get current filter definition
		var filterDef = parseInitArray(initObj.filterDropDown);

		if (filterDef.ajax == null) {
			api.columns(filterDef.columnsIdxList).every(function () {
				let column = this
				let select = initSelectForColumn(id, column);
				column.data().unique().sort().each(function (d) {
					addOption(select, d)
				});
			});
		} else {
			// fetch column options from server for server side processing
			let columnsQuery = (
				"columns="
				+ encodeURIComponent(
					api.columns(filterDef.columnsIdxList).dataSrc().join()
				)
			)
			$.getJSON(filterDef.ajax + "?" + columnsQuery, function (columnsOptions) {
				api.columns(filterDef.columnsIdxList).every(function () {
					let column = this;
					let select = initSelectForColumn(id, column);
					let columnName = column.dataSrc()
					if (columnName in columnsOptions) {
						columnsOptions[columnName].forEach(function (d) {
							addOption(select, d)
						});
					} else {
						console.warn(
							"Missing column '" + columnName + "' in ajax response."
						)
					}
				});
			});
		}
	});

}(jQuery));
