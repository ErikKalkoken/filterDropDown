/*
 * filterDropDown.js
 *
 * Copyright (C) 2017 Erik Kalkoken
 *
 * Extension for DataTables v1.10.0 (developed and test with v1.10.15)
 *
 * Adds a dropDown element for selected columns to a Datatable
 * allowing the user to filter the table to only show rows containing
 * a certain value. e.g. in a list of employees to only show the ones 
 * that have an office in a certain city.
 *
 * Features:
 * - Optionally works with Bootstrap 3 styling
 * - Uses column header as default title, can be overriden with custom title
 * - CSS styles and/or CSS classes can be applied to each filter element
 *
 * Usage:
 * 1. Include this file into your html file your after the inclusion of dataTables JS
 * 2. Add a filterDropDown section in the DataTables initialisation object
 * 
 * Example:
 *	$('#example').DataTable({
 * 		filterDropDown: {									
 *			columns: [
				idx: 3
			]
 *		}
 *	} );
 *
**/

(function($){
	
	// parse initialisation array and returns filterDef array to faster and easy use
	// also sets defaults for properties that are not set
	function parseInitArray(initArray)
	{
		// initialisation and setting defaults
		var filterDef = {
			"columns": [],
			"bootstrap": false
		};
		
		// set bootstrap property if it exists
		if ( ("bootstrap" in initArray) && (typeof initArray.bootstrap === 'boolean') )
		{
			filterDef.bootstrap = initArray.bootstrap;
		}
							
		// add definition for each column
		if ("columns" in initArray)
		{								
			for(var i=0; i<initArray.columns.length; i++)
			{
				var initColumn = initArray.columns[i];
				
				if ( ("idx" in initColumn) && (typeof initColumn.idx === 'number') )
				{
					// initilialize column					
					var idx = initColumn.idx;					
					filterDef['columns'][idx] = {
						"cssStyle": "",
						"cssClass": (filterDef.bootstrap) ? "form-control " : "",
						"titleOverride": null
					};
					
					// set properties if they have been defined accordingly, otherwise the defaults will be used
					if ( ('cssStyle' in initColumn) && (typeof initColumn.cssStyle === 'string') )
					{
						filterDef['columns'][idx].cssStyle = initColumn.cssStyle;
					}
					
					if ( ('cssClass' in initColumn) && (typeof initColumn.cssClass === 'string') )
					{
						filterDef['columns'][idx].cssClass  += initColumn.cssClass ;
					}
					
					if ( ('titleOverride' in initColumn) && (typeof initColumn.titleOverride === 'string') )
					{
						filterDef['columns'][idx].titleOverride = initColumn.titleOverride;
					}
				}
			}			
		}
		
		return filterDef;		
	}
	
	// Add filterDropDown container div and add default options to dropDowns
	// use preInit so that elements are created and correctly shown before data is loaded
	$(document).on( 'preInit.dt', function ( e, settings ) 
	{
		if ( e.namespace !== 'dt' ) {
			return;
		}
		
		// get api object for current dt table
		var api = new $.fn.dataTable.Api( settings );
		
		// get id of current table
		var id = api.table().node().id;
		
		// get initialisation object for current table to retrieve custom settings
		var initObj = api.init();
		
		// only proceed if filter has been defined in current table, otherwise don't do anything.
		if (!("filterDropDown" in initObj)) return;
				
		// get current filter definition from init array
		var filterDef =  parseInitArray(initObj.filterDropDown);
		
		// only proceed if there are any columns defined
		if (filterDef.columns.length == 0) return;		
		
		// get container div for current data table to add new elements to
		var container = api.table().container();
		
		// add filter elements to DOM			
		var filterWrapperId = id + "_filterWrapper";
		var divCssClass = (filterDef.bootstrap) ? "form-inline" : "";
		$(container).prepend('<div id="' + filterWrapperId + '" class="' + divCssClass + '">Filter </div>');
		
		api.columns(Object.keys(filterDef.columns)).every( function () 
		{
			var column = this;
			var idx = column.index();
			
			// set title of current column
			var colName = ( filterDef.columns[idx].titleOverride !== null )
				? filterDef.columns[idx].titleOverride 
				: $(this.header()).html();
			
			// adding select element for current column to container
			var selectId = id + "_filterSelect" + idx;			
			$('#' + filterWrapperId).append('<select id="' + selectId 
				+ '" class="' + filterDef.columns[idx].cssClass + '" style="' + filterDef.columns[idx].cssStyle + '"></select>');
			
			// initalising select for current column and appling event to react to changes
			var select = $("#" + selectId).empty()
				.append( '<option value="">(' + colName + ')</option>' );
		} );
	
	} );
	
	// filter table and add available options to dropDowns
	$(document).on( 'init.dt', function ( e, settings ) 
	{
		if ( e.namespace !== 'dt' ) {
			return;
		}
		
		// get api object for current dt table
		var api = new $.fn.dataTable.Api( settings );
		
		// get id of current table
		var id = api.table().node().id;
		
		// get initialisation object for current table to retrieve custom settings
		var initObj = api.init();
		
		// only proceed if filter has been defined in current table, otherwise don't do anything.
		if (!("filterDropDown" in initObj)) return;
		
		// get current filter definition
		var filterDef =  parseInitArray(initObj.filterDropDown);
		
		// get container div for current data table to to add new elements to
		var container = api.table().container();
						
		api.columns(Object.keys(filterDef.columns)).every( function () 
		{
			var column = this;
			var idx = column.index();
						
			// adding select element for current column to container
			var selectId = id + "_filterSelect" + idx;							
						
			// initalising select for current column and appling event to react to changes
			var select = $("#" + selectId)			
				.on( 'change', function () 
				{
					var val = $.fn.dataTable.util.escapeRegex(
						$(this).val()
					);

					column
						.search( val ? '^' + val + '$' : '', true, false )
						.draw();
				} );

			column.data().unique().sort().each( function ( d, j ) 
			{
				select.append( '<option value="' + d + '">' + d + '</option>' )
			} );
		
		} );
	
	} );

}(jQuery));

