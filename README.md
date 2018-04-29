# filterDropDown
Extension for JQuery plug-in DataTables adding drop down filter elements for selected columns

## Description
Adds a dropDown element for selected columns to a Datatable allowing the user to filter the table to only show rows containing a certain value. e.g. in a list of employees to only show the ones that have an office in a certain city.
The filter element extracts all unique values from a column and adds them sorted and stripped as options.

Here is a screenshot showing how it looks like in action:
![alt text](http://i.imgur.com/3PmLZKA.png "Example Screenshot of the filterDropDown")

## Features
 - Optionally works with Bootstrap 3 styling
 - Uses column header as default title, can be overriden with custom title
 - CSS styles and/or CSS classes can be applied to each filter element
 
## Usage
 1. Download `filterDropDown.min.js` to your website. You find the latest version in the `js` folder.
 2. Include`filterDropDown.min.js` into your html file. It must be after the inclusion of dataTables JS
 3. Add a filterDropDown section in the DataTables initialisation object
 
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

## Dependencies
- JQuery: 1.12.4
- DataTables: 1.10.15
- Bootstrap: 3.3.7

It might work with earlier versions, but that has not been tested.

## Configuration options
All configuration opions must be set in the `filterDropDown` section of the initialisation array for your respective DataTable.

Option|Type|Mandatory|Default|Description
--------|-------|-------|--------|-----------
bootstrap|boolean|no|false|Defines whether Bootstrap styling should be applied
autoSize|boolean|no|true|Turns off auto sizing for all select elements to the width of its title. Useful if table is rendered on hidden tab. (NEW)
label|string|no|"Filter "|Text displayed at the beginning of the filter row. This option can be useful if label should be shown in other languages
columns|array|yes|N/A|Array of definition, one for each column that gets a filter element
columns[].idx|number|yes|N/A|Index of selected column, starting at 0 for the first column. Same as indices used in DataTables config array
columns[].autoSize|boolean|no|true|Turns off auto sizing for this select elements to the width of its title. Useful if table is rendered on hidden tab. (NEW)
columns[].maxWidth|string|no|automatic width, so that title will fit. Turned off for screens < 768 pixels|css value to assigned to max-width. use "none" to turn off automatic max-width
columns[].title|string|no|header text of respective column or just "column x" if column has no header label|This is useful if you want to filter by the contents of an invisible column that usually would not have any header label

## Styling
The extension will generate classes for each filter that you can use to apply CSS styling. There are two classes for each table:
- `[tableId]_filterWrapper`: this class is assigned to the div that encapsulated the whole filter element and the label. Use this to apply styles to the label.
- `[tableId]_filterSelect`: this class is assigned to each select element
The class names are generated based on the table ID. So e.g. if the table has the ID `example`, then the wrapper class will be called `example_filterWrapper`.

## FAQ

#### Question:
I have a column with html styled data and the option list of its dropDown does still contain parts of the html. How do I filter by the plain value only?

#### Answer:
Add an invisible column containing only the plan values and filter by that column instead. Use `titleOverride` to set the correct title for the dropDown element.

#### Question:
The select elements are too small when rendered. How can I change the width of each column?

#### Answer:
The width of the select elemen for each column is automatically set to width of its title to safe space. This can be turned off for each column or globally for the whole table with the `autoSize` property.

## History

Date|Version|Type|Description
--------|-------|-------|-------
29-APR-2018|v0.3.0|New|Added option to turn-off auto-sizing. useful if table is rendered on hidden tab
27-NOV-2017|v0.2.1|Fix|Auto-Width of Select was too small with Chrome
16-SEP-2017|v0.2.0|Change|removed cssStyle, cssClass parameter removed, replaced with generated classes for wrapper and selects renamed titleOverride to title, added label parameter to customized label text, added automatic max-width based on title size, added optional maxWidth to override / turn-off the automatic
29-AUG-2017|v0.1.0|New|Initial version
