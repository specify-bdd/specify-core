export const testAlignment = {
    "meta":  {
        "type": "layout",
        "docs": {
            "description": "Test alignment of object properties",
            "category":    "Stylistic Issues",
            "recommended": true,
            "foobar":      {
                "somemultiline": "value",
                "anothervalue":  "here",
            },
            "example":  "This is an example of a multiline comment that should be aligned",
            "example2": "This is another example of a multiline comment that should be aligned",
        },
        "fixable":   "whitespace",
        "schema":    [],
        "messages":  {
            "misalignedProperty":
                "Object properties should be aligned with adjacent properties",
        },
    },
};