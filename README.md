
# Guten Block Fields
> WordPress Gutenberg development tool.

[![NPM version](https://img.shields.io/npm/v/guten-block-fields.svg?style=flat-square)](https://www.npmjs.com/package/guten-block-fields)
[![npm](https://img.shields.io/npm/dt/guten-block-fields.svg?style=flat-square)](https://www.npmjs.com/package/guten-block-fields)
[![GitHub stars](https://img.shields.io/github/stars/emgk/guten-block-fields.svg?style=social&label=Star)](https://github.com/emgk/guten-block-fields)

When you creating blocks in Gutenberg, You may want more fields to manage the block's content. Gutenberg has a section called Inspector Controller which appears on the right side of the block when you click on particular block on editor. This package will help you to create those field in more easy.

## Install

```
$ npm install guten-block-fields
```

## Usage

```
$ guten-block-fields make 
```

## Create fields
To create or manage block's field you'll need to create a `block-fields.json` file in your plugin's root folder.

A `block-fields.json` file:

- list the block's field and manage them anytime.
- makes your field reproducible, and therefore much easier to share with another block.


### "block-fields.json" options

#### name 

Type: `string`

Name of your component.

#### output

Type: `string`

The path where you want to land of the generated files.


#### toggles

Type: `object`

List of the toggle

Example: 
````
"toggles": {
        "bio": {
            "title": "Bio data",
            "isOpen": true,
        },
        "occuption": {
            "title":"Occuption",
            "isOpen":false
        }
    }
````

#### fields

Type: `array`

Pass the list of the field which needs to be required generated.

##### Options: 

- `title` Title or label of the field.
- `id` id of the field.
- `type` Type of the field. 
- `value` Default value of the field.
- `toggle` Toggle id in which this field should be appear. See "toggle" option above.
- `baseControl` Whether field should wrapper inside the <baseControl> or not.  

### Supported fields
> More fields are on the way.

#### text 
Render <TextControl />

##### example:
````
{
    "title": "Your Name",
    "id": "your-name",
    "type": "text",
    "value": "john doe",
    "toggle": "bio",
    "baseControl": true
}
````

#### checkbox
Render <CheckboxControl />

Additional option:
- `checked` `<true|false>`

##### example:
````
{
    "title": "Accept t&c",
    "label": "Sample",
    "id": "sample",
    "toggle": "bio",
    "checked": true,
    "type": "checkbox"
},
````

#### button
Render `<Button />`

##### example:
````
{
    "title": "Save Changes",
    "type": "button",
    "id": "save-change",
    "toggle": "occuption",
    "default": false,
    "class": "save"
},
````

#### button-group
Render `<ButtonGroup />`

##### example:
````
{
    "title": "Button Group",
    "type": "button-group",
    "id": "button-group",
    "toggle": "occuption",
    "buttons": [
        {
            "isPrimary": true,
            "class": "red",
            "label": "Red",
            "id": "red"
        },
        {
            "isPrimary": false,
            "class": "blue",
            "label": "Blue",
            "id": "blue"
        }
    ]
},
````

#### Select
Render `<Select />`

##### example
````
{
    "type": "select",
    "value": "india",
    "id": "country",
    "title": "Country",
    "options": [
        {
            "label": "India",
            "value": "india"
        },
        {
            "label": "USA",
            "value": "usa"
        }
    ]
},
````

#### Radio 
Render `<RadioControl />`

##### example:
````
{
    "type": "radio",
    "title": "Gender",
    "id": "gender",
    "value": "male",
    "options": [
        {
            "label": "Male",
            "value": "male"
        },
        {
            "label": "Female",
            "value": "female"
        }
    ]
},
````

#### Range 
Render `<RangeControl />`

````
{
    "type": "range",
    "title": "Volume",
    "id": "volume",
    "min": 1,
    "max": 100,
    "value": 40
}
````

