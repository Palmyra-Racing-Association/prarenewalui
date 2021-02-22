import React from 'react';
import "bootstrap/dist/css/bootstrap.css";
import './FamilyAndBikes.css';
import Form from "react-jsonschema-form";
import axios from 'axios';
import Env from './Env';
import _ from 'lodash';

const schema = {
  "title": "PRA Member Renewal Form",
  "description": "Your information is displayed below.  Please update your address if it is out of date - this is the address we will mail your stickers to."+
    " Please do the same for your phone number if necesssary.  " +
    "  Also be sure to add your family members, and at least one bike.  If you are the only person on a membership, you don't need to add yourself, but you do need to add at least one bike. " +
    "Finally, please be sure to re-read the rules which you can find at http://www.palmyramx.com/wordpress/wp-content/uploads/2017/02/PRA-Rules-And-Sound.pdf.  Your renewal implies that you agree to these.",
  "type": "object",
  "required": [
    "firstName",
    "lastName",
    "address",
    "city",
    "zip",
    "phone",
    "bikes",
    "insuranceCapture"
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
      "title": "Upload a copy of your insurance card(s)."
    },
    "agreement": {
      "type": "string",
      "title": "Agree to the rules.  Type YOUR NAME I agree.  This has already been filled in for you."
    },
    "token": {
      "type": "string"
    }
  },
  "definitions": {
    "FamilyMember": {
      "type": "object",
      required: ['firstName', 'lastName', 'age'],
      "properties": {
        "firstName": {
          "type": "string",
          "title": "First Name"
        },
        "lastName": {
          "type": "string",
          "title": "Last Name"
        },
        "age": {
          "type": "number",
          "enum": _.range(0, 100),
          "title": "Age"
        }
      }
    },
    "Bike": {
      "type": "object",
      "required": [ 'year', 'make', 'model'],
      "properties": {
        "year": {
          "type": "number",
          "enum": _.rangeRight(1968, (new Date()).getFullYear()+2),
          "title": "Model Year"
        },
        "make": {
          "type": "string",
          "enum": [
            "Alta", "Cobra", "Gas Gas", "GPX", "Honda", "Husqvarna", "Kawasaki", "KTM", "Scorpa", "Sherco", "Suzuki", "Thumpstar", "TM", "Yamaha", "Other"
          ],
          "title": "Make"
        },
        "model": {
          "type": "string",
          "title": "Model"
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
    "classNames": "smallField"
  },
  "token": {
    "ui:widget": "hidden"
  },
  "insuranceCapture": {
    "ui:help": "Tips for a good insurance card photo: reduce image quality in camera settings, or take the picture in black and white.  "+
      "Or, do both.  Large files (500000 bytes or 5 MB) may fail to upload.  These tips will make yours a lot smaller than that."
  }

};
const apiUrl = Env.api_url;

let formData = {
}

let token = window.location.search.replace(/\?token=/g, "");

const onSubmit = ({formData}) => {
  axios.post(Env.api_url+'/members/renew', formData)
  .then(function (response) {
    document.getElementById("submitBtn").disabled = true;
    document.getElementById("submitted").style.visibility= "visible";
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
    document.getElementById("error-submitting").style.visibility= "visible";
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
    formData.agreement = data.first_name + ' ' + data.last_name + ' I agree'
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
        Thanks for submitting your renewal!  You should be all set, just send your payment per the
        instructions in email!
      </div>
      <div id="error-submitting">
        Sorry, there was an error trying to submit your renewal.  Please take reduce the image quality of your phone camera, change the photo to black and white
        after taking it, or take the picture from farther away.
        <p/>
        <a href="https://www.dummies.com/consumer-electronics/smartphones/droid/how-to-set-the-image-resolution-on-your-androids-camera-app/" target="_new">
          How to reduce image quality on Android
        </a>
      </div>
    </Form>
    );
  }
}