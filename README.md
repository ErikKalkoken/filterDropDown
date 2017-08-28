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
