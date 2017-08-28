# filterDropDown
Extension for JQuery plug-in DataTables adding drop down filter elements for selected columns

## Description
Adds a dropDown element for selected columns to a Datatable allowing the user to filter the table to only show rows containing a certain value. e.g. in a list of employees to only show the ones  that have an office in a certain city.
 
## Features
 - Optionally works with Bootstrap 3 styling
 - Uses column header as default title, can be overriden with custom title
 - CSS styles and/or CSS classes can be applied to each filter element
 
## Usage
 1. Include the javascript file into your html file your after the inclusion of dataTables JS
 2. Add a filterDropDown section in the DataTables initialisation object
 
## Example
 	<!-- This is your HTML file -->
	<head>
		<!-- all your includes for Jquery, Bootstrap (optionally), Datatables above -->

		<!-- Now we include the actual plugin -->
		<script src="filterDropDown.min.js"></script>

		<!-- Finally you define your DataTables table and include a filterDropDown section in the initialisation array -->
		<script>
			$(document).ready(function() {
				$('#example').DataTable({
					filterDropDown: {									
						columns: [
							idx: 3
						]
					}
				} );
			} );
		</script>
	</head>

Also see folder `examples` for complete examples including both vanilla html and Bootstrap.

## Configuration options
All configuration opions must be set in the `filterDropDown` section of the initialisation array for your respective DataTable.

Option|Type|Mandatory|Default|Description
--------|-------|-------|--------|-----------
bootstrap|boolean|no|false|Defines whether Bootstrap styling should be applied
columns|array|yes|N/A|Array of definition, one for each column that gets a filter element
columns[].idx|number|yes|N/A|Index of selected column, starting at 0 for the first column. Same as indices used in DataTables config array
columns[].cssStyle|string|no|""|CSS style to be applied to this select element.
columns[].cssClass|string|no|""|CSS class to be applied to this select element.

