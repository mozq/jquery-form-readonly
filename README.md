[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://raw.githubusercontent.com/mozq/jquery-form-readonly/master/LICENSE.txt)

# jquery-form-readonly

This is a jQuery plug-in that makes HTML form elements read-only.


## Usage

### Install

Include jquery-form-readonly after jQuery library.

    <script src="//code.jquery.com/jquery-3.2.1.js"></script> <!-- jQuery -->
    <script src="//cdn.jsdelivr.net/gh/mozq/jquery-form-readonly@0.1.0/dist/jquery.form-readonly.min.js"></script> <!-- jquery-form-readonly -->

### Enable read-only

Please call .formReadonly() method.

    $('form').formReadonly();

You can apply this method for any jQuery elements.

    $('input[type="text"]').formReadonly();
    $('div.fooClass').formReadonly();
    $('#barId').formReadonly();

The following elements contains in jQuery elements is to be processed.

|Element  |Type                                  |
|---------|--------------------------------------|
|input    |text, password, checkbox, radio, file |
|textarea |N/A                                   |
|select   |N/A                                   |

#### Options

You can specify following options.

|Option             |Type                    |Description                                   |Default value  |
|-------------------|------------------------|----------------------------------------------|---------------|
|multipleSeparator  |string, element, etc... |Separator of multiple value                   |', '           |
|passwordMaskChar   |string                  |Character of password mask                    |'*'            |
|passwordMaskLength |number                  |Fixed length of password                      |-1 (not fixed) |
|useLabel           |boolean                 |Use label when presented by checkbox or radio |false          |
|includesReadonly   |boolean                 |Includes read-only form elements to target    |false          |
|includesDisabled   |boolean                 |Includes disabled form elements to target     |false          |
|excludes           |function(p1)            |Function to exclude form elements             |null           |

Sample code:

    $('form').formReadonly({
      multipleSeparator: $('<br>'),
      passwordMaskChar: '#',
      passwordMaskLength: 16,
      useLabel: true,
      includesReadonly: true,
      includesDisabled: true,
      excludes: function ($elm) { return ($elm.prop('type') === 'radio'); },
    });

### Cancel read-only

Specifying false for the argument cancels read-only.

    $('form').formReadonly(false);


## License

The jquery-form-readonly is open-sourced software licensed under the [MIT license](https://raw.githubusercontent.com/mozq/jquery-form-readonly/master/LICENSE.txt).
