module.exports = 
{
    "title": "PRA Member bike sticker program",
    "description": "You information is displayed below.  Please update your address if it is out of date - this is the address we will mail your stickers to."+
      "  Also be sure to add your family members, and bikes.",
    "type": "object",
    "required": [
      "firstName",
      "lastName", 
    ],
    "properties": {
      "firstName": {
        "type": "string",
        "title": "First name"
      },
      "lastName": {
        "type": "string",
        "title": "Last name"
      },
      "email": {
        "type": "string",
        "format": "email",
        "title": "E-mail"
      },
      "address": {
        "type": "string",
        "title": "Address"
      },
      "city": {
        "type": "string",
        "title": "City"
      },
      "zip": {
        "type": "number",
        "title": "Zip",
        "minimum": 11111,
        "maximum": 99999
      },
      "fixedItemsList": {
        "type": "array",
        "title": "A list of fixed items",
        "items": [
          {
            "title": "A string value",
            "type": "string",
            "default": "lorem ipsum"
          },
          {
            "title": "a boolean value",
            "type": "boolean"
          }
        ],
        "additionalItems": {
          "title": "Additional item",
          "type": "number"
        }
      },
      "token": {
        "type": "string"
      }
    }
};