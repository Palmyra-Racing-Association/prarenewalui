import React from 'react';
import "bootstrap/dist/css/bootstrap.css";
import './FamilyAndBikes.css';
import Form from "react-jsonschema-form";
import axios from 'axios';
import Env from './Env';
import _ from 'lodash';

const schema = {
  "title": "PRA Member bike sticker program",
  "description": "Your information is displayed below.  Please update your address if it is out of date - this is the address we will mail your stickers to."+
    " Please do the same for your phone number if necesssary.  " +
    "  Also be sure to add your family members, and at least one bike.  If you are the only person on a membership, you don't need to add yourself, but you do need to add at least one bike.",
  "type": "object",
  "required": [
    "firstName",
    "lastName",
    "address",
    "city",
    "zip",
    "phone",
    "bikes"
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
    "state": {
      "type": "string",
      "title": "State",
      "default": "NY",
    },
    "zip": {
      "type": "string",
      "title": "Zip"
    },
    "phone": {
      "type": "string",
      "title": "Phone"
    },  
    "familyMembers": {
      "title": "Family Members (please enter one per line.  If you're the only one on a membership, there's no need to include yourself here)",
      "type": "array",
      "items": {
        "$ref": "#/definitions/FamilyMember"
      }
    },
    "bikes": {
      "type": "array",
      "title": "Please list all bikes you intend to ride at PRA (at least one required)",
      "minItems": 1,
      "items": {
        "$ref": "#/definitions/Bike"
      }
    },
    "insuranceCapture": {
      "type": "string",
      "format": "data-url",
      "title": 
        "Upload a copy of your insurance card(s). You can take a picture with your phone and attach it. You can also scan it. "+
        "If can't upload it you can email or mail it. (optional if you've not done it yet)",
    },
    "agreement": {
      "type": "string",
      "title": "Agree to the rules.  Type YOUR NAME I agree.  YOUR NAME has already been filled in for you. (Optional if you have not done it yet)"
    },
    "token": {
      "type": "string"
    }
  },
  "definitions": {
    "FamilyMember": {
      "type": "object",
      required: ['firstName', 'lastName'],
      "properties": {
        "firstName": {
          "type": "string",
          "title": "First Name"
        },
        "lastName": {
          "type": "string",
          "title": "Last Name"
        }        
      }
    },
    "Bike": {
      "type": "object",
      "required": [ 'year', 'make', 'model'],
      "properties": {
        "year": {
          "type": "number",
          "enum": _.rangeRight(1968, (new Date()).getFullYear()+1)
        },
        "make": {
          "type": "string",
          "enum": [
            "Alta", "Cobra", "Gas Gas", "Honda", "Husqvarna", "Kawasaki", "KTM", "Sherco", "Suzuki", "TM", "Yamaha", "Other"
          ]
        },
        "model": {
          "type": "string"
        }
      }
    },    
  }

};

const uischema = {
  "firstName": {
    "ui:autofocus": false,
    "ui:emptyValue": "",
    "ui:readonly": true,
    "classNames": "smallField"
  },
  "lastName": {
    "ui:autofocus": false,
    "ui:emptyValue": "",
    "ui:readonly": true,
    "classNames": "smallField"
  }, 
  "email": {
    "ui:autofocus": false,
    "ui:emptyValue": "",
    "ui:readonly": true,
    "classNames": "smallField"
  },
  "street": {
    "ui:autofocus": true,
    "classNames": "smallField"
  },
  "state": {
    "ui:readonly": true,
  },
  "familyMembers": {
    "ui:widget": "textarea",
    "ui:options": {
      "rows": 5
    }
  },
  "bikes": {
    classNames: "small-field"
  },  
  "token": {
    "ui:widget": "hidden"
  },
 
};
const apiUrl = Env.api_url;

let formData = {
}

let token = window.location.search.replace(/\?token=/g, "");

const onSubmit = ({formData}) => {
  console.log("Data submitted: ",  formData);
  document.getElementById("submitBtn").disabled = true;
  document.getElementById("submitted").style.visibility= "visible";
  
  axios.post(Env.api_url+'/members/captureBikes', formData)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  
}
export default class FamilyAndBikes extends React.Component {

  async componentWillMount() {
    let memberResponse = await axios.get(apiUrl+'/members/'+token);
    let data = memberResponse.data;
    formData.lastName = data.last_name;
    formData.firstName = data.first_name;
	  formData.email = data.email;
	  formData.address = data.address;
	  formData.city = data.city;
	  formData.state = data.state;
    formData.zip = data.zip;
    formData.phone = data.phone;
    formData.token = token;    
    //console.log(formData);  
    this.setState({formData});
  }
  render() { 
    const log = (type) => console.log.bind(console, type);
    return (
    <Form schema={schema} uiSchema={uischema} formData={formData}
        onChange={log("changed")}
        onSubmit={onSubmit}
        onError={log("errors")}>
      <div>
        <button id="submitBtn" type="submit" className="btn btn-info">Submit</button>
      </div>
      <div id="submitted">
        Thanks for submitting your information!  Your stickers should be mailed out soon!
      </div>
    </Form>
    );
  }
}