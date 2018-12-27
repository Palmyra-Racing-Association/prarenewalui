module.exports = 
{
    "title": "PRA Membership Rules Acknowledgement",
    "description": 
      "As a member of Palmyra Racing Association, I agree to uphold and adhere to the Membership Rules outlined in the "+
      "attached document, and the Bylaws as adopted by the Board and Distant Riders. Failure to comply will result in Board review with possible suspension or termination of my PRA membership.",
    "type": "object",
    "required": [
      "firstName",
      "lastName", 
      "insuranceCapture", 
      "agreement"
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
      "insuranceCapture": {
        "type": "string",
        "format": "data-url",
        "title": 
          "Upload a copy of your insurance card(s). You can take a picture with your phone and attach it. You can also scan it. "+
          "If can't upload it you can email or mail it. ",
      },
      "agreement": {
        "type": "string",
        "title": "Agree to the rules.  Type YOUR NAME I agree.  YOUR NAME has already been filled in for you."
      },
      "token": {
        "type": "string"
      }
    }
  };