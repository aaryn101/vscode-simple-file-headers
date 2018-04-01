# Simple File headers

The `Simple File Headers` extension makes it easy to create file headers and add them to the current document.

## Features

* per-language, or global, file headers
* variable substitution

## Defining Templates

Templates are defined using the `simplefileheaders.templates` setting. Here is an example:

```json
"simplefileheaders.templates": [{
    "text": [
        "/**",
        " * this is a multi-line header that will be used by JS and Java files",
        " */"
    ],
    "useWith": ["java", "javascript"]
}, {
    "text": [
        "// this is a single-line header that will be used by everything else"
    ],
    "useWith": ["*"]
}],
```

* `text`: an array of strings, each string representing a line
  * variables can be added using `{MY_VAR_NAME}`, see [Using Variables](#using-variables) for more information
* `useWith`: an array of language IDs to use this template with - see [VS Code Language Identifiers](https://code.visualstudio.com/docs/languages/identifiers) for more information
  * you can use "\*" to indicate that the template should be used if a template with a more specific language ID can't be found

## Using Variables

Variables are defined using the `simplefileheaders.variables` setting. Here is an example:

```json
"simplefileheaders.templates": [{
    "text": [
        "/**",
        " * this header uses variables:",
        " * Year: {YEAR}",
        " * Company: {COMPANY}",
        " */"
    ],
    "useWith": ["java", "javascript"]
}],
"simplefileheaders.variables": {
    "YEAR": "2018",
    "COMPANY": "My Company"
}
```

## Extension Settings

This extension contributes the following settings:

* `simplefileheaders.insertAt`: where to insert the file header, either at the cursor or the start of the file
* `simplefileheaders.templates`: an array of template definitions, see [Defining Templates](#defining-templates)
* `simplefileheaders.variables`: variables that will be replaced when found in templates, see [Using Variables](#using-variables)
