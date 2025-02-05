# filterDropDown

Extension for JQuery plug-in DataTables adding drop down filter elements for selected columns

![version](https://img.shields.io/badge/release-0.5.0-orange)
![jQuery](https://img.shields.io/badge/jQuery-3.7.0-blue)
![DataTables](https://img.shields.io/badge/DataTables-1.13.7-blue)
![bootstrap](https://img.shields.io/badge/Bootstrap-3_|_5-blue)

## Contents

- [Description](#description)
- [Usage](#usage)
- [Example](#example)
- [Special features](#special-features)
- [Configuration options](#configuration-options)
- [Dependencies](#dependencies)
- [Tests](#tests)
- [FAQ](#faq)
- [Change Log](CHANGELOG.md)

## Description

Adds a dropDown element for selected columns to a datatable allowing the user to filter the table to only show rows containing a certain value. e.g. in a list of employees to only show the ones that have an office in a certain city.
The filter element extracts all unique values from a column and adds them sorted and stripped as options.

### Key Features

- Uses column header as default title, can be overridden with custom title
- CSS styles and/or CSS classes can be applied to each filter element
- Supports Bootstrap 3 and Boostrap 5 styling
- Supports server-side processing

### Screenshot

Here is a screenshot showing how it looks like in action:
![alt text](https://i.imgur.com/3PmLZKA.png "Example Screenshot of the filterDropDown")

## Usage

 1. Download `filterDropDown.min.js` to your website. You find the latest version in the `js` folder.
 2. Include`filterDropDown.min.js` into your html file. It must be after the inclusion of dataTables JS
 3. Add a filterDropDown section in the DataTables initialization object

## Example

```html
<!-- This is your HTML file -->
<head>
    <!-- all your includes for Jquery, Bootstrap (optionally), Datatables above -->

    <!-- Now we include the actual plugin -->
    <script src="filterDropDown.min.js"></script>

    <!-- Finally you define your DataTables table and include a filterDropDown section in the initialization array -->
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
```

Also see folder `examples` for complete examples including both vanilla html and Bootstrap.

## Special features

### Styling

The extension will generate classes for each filter that you can use to apply CSS styling. There are two classes for each table:

- `[tableId]_filterWrapper`: this class is assigned to the div that encapsulated the whole filter element and the label. Use this to apply styles to the label.
- `[tableId]_filterSelect`: this class is assigned to each select element

The class names are generated based on the table ID. So e.g. if the table has the ID `example`, then the wrapper class will be called `example_filterWrapper`.

### Server-side processing

DataTables can use to server-side processing, and filterDropDown also supports it.

To use server-side processing your app will needs two things:

1. An endpoint for filterDropDown that provides the necessary data, similar to the endpoint needed to power DataTables server-side processing feature.
2. The endpoint for DataTables must support the feature of searching columns with regex (`columns[{num}][search][regex]`)

To enable server-side processing just provide an URL to that endpoint in the `ajax` property of the filterDropDown init array.

The endpoint for filterDropDown needs to implement the following protocol:

#### Request

The endpoint will receive a GET request with the following query parameter:

- `columns`: list of requested columns, either by name or index (depends on `columns` definition)

Example2:

```plain
http://www.example.com/endpoint?columns=2,3,0
http://www.example.com/endpoint?columns=office,position,name
```

Column names will match with the names defined in the DataTables init array under `data` for each column.

#### Response

The endpoint will need to respond with an JSON object that has the requested columns as property key and the sorted list of options as it's respective values.

Note that all data processing like selecting unique values and sorting is expected to happen by the server.

Examples:

```JSON
{
    "office":
        [
            "Edinburgh", "London", "New Yok", "San Francisco", "Sidney", "Tokyo"
        ],
    "position":
        [
            "Accountant", "Customer Support", "Data Coordinator", "Developer"
        ]
}
```

```JSON
{
    "2":
        [
            "Edinburgh", "London", "New Yok", "San Francisco", "Sidney", "Tokyo"
        ],
    "3":
        [
            "Accountant", "Customer Support", "Data Coordinator", "Developer"
        ]
}
```

#### Error handling

In case columns are missing in the response, those will be reported with a warning in the browser console.

## Configuration options

All configuration options must be set in the `filterDropDown` section of the initialization array for your respective DataTable.

Option|Type|Mandatory|Default|Description
--------|-------|-------|--------|-----------
bootstrap|boolean|no|`false`|Defines whether Bootstrap styling should be applied
bootstrap_version|int|no|`3`|Set the Bootstrap version for rendering. Supports `3` and `5`.
autoSize|boolean|no|`true`|Turns off auto sizing for all select elements to the width of its title. Useful if table is rendered on hidden tab.
label|string|no|`"Filter "`|Text displayed at the beginning of the filter row. This option can be useful if label should be shown in other languages
ajax|string|no|`null`|URL to server endpoint for server-side processing. Enabled by providing a value.
columns|array|yes|N/A|Array of definition, one for each column that gets a filter element
columns[].idx|number|yes|N/A|Index of selected column, starting at 0 for the first column. Same as indices used in DataTables config array
columns[].autoSize|boolean|no|`true`|Turns off auto sizing for this select elements to the width of its title. Useful if table is rendered on hidden tab.
columns[].maxWidth|string|no|automatic width, so that title will fit. Turned off for screens < 768 pixels|css value to assigned to max-width. use `"null"` to turn off automatic max-width or specify a custom width, e.g. `"5em"`
columns[].title|string|no|header text of respective column or just "column x" if column has no header label|This is useful if you want to filter by the contents of an invisible column that usually would not have any header label

## Dependencies

- JQuery: 1.12.4+
- DataTables: 1.10.15+
- Bootstrap: 3.3.7+

It might work with earlier versions, but that has not been tested.

## Tests

You find test instrumentation in the `tests` folder. There are two parts:

- Web server
- Unit tests for the web server

### Setup

The tests are running a web server build with with [Flask](https://flask.palletsprojects.com/en/1.1.x/). Here is how to setup your test environment:

```sh
python3 -m venv venv
source venv/bin/activate
cd tests
pip install -r requirements.txt
```

### Web server

The web server will render a web site with several example data tables, which will allow you to manually test the filterDropDown library with various scenarios, e.g.:

- Vanilla style
- Bootstrap style
- Server side processing

Here is how to start the web server (we recommend doing this in a Python virtual environment):

```sh
cd tests
flask run
```

### Web server unit tests

The unit tests are in Python and only test the web server, not the filterDropDown library. These tests only need to run when the web server code was changed.

Here is how you can run these tests:

```sh
cd tests
python app_test.py
```

## FAQ

### Question

I have a column with html styled data and the option list of its dropDown does still contain parts of the html. How do I filter by the plain value only?

### Answer

Add an invisible column containing only the plan values and filter by that column instead. Use `titleOverride` to set the correct title for the dropDown element.

### Question

The select elements are too small when rendered. How can I change the width of each column?

### Answer

The width of the select element for each column is automatically set to width of its title to safe space. This can be turned off for each column or globally for the whole table with the `autoSize` property.
