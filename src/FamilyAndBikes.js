import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './FamilyAndBikes.css';
import Form from "react-jsonschema-form";
import axios from 'axios';
import Env from './Env';

const schema = {
  "title": "PRA Member bike sticker program",
  "description": "You information is displayed below.  Please update your address if it is out of date - this is the address we will mail your stickers to."+
    "  Also be sure to add your family members, and bikes.",
  "type": "object",
  "required": [
    "firstName",
    "lastName",
    "address",
    "city",
    "zip",
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
    "zip": {
      "type": "string",
      "title": "Zip"
    },
    "familyMembers": {
      "type": "string",
      "title": "Family Members (please enter one per line.  If your the only one on a membership, there's no need to include yourself here)"
    },   
    "bikes": {
      "type": "string",
      "title": "Bikes (please enter Year Make Model, ie: 2018 KTM 250 EXC-F), one per line.  At least one required."
    },
    "token": {
      "type": "string"
    }
  }
};

const uischema = {
  "firstName": {
    "ui:autofocus": true,
    "ui:emptyValue": "",
    "ui:readonly": true,
  },
  "lastName": {
    "ui:autofocus": false,
    "ui:emptyValue": "",
    "ui:readonly": true,
  }, 
  "email": {
    "ui:autofocus": false,
    "ui:emptyValue": "",
    "ui:readonly": true,
  },
  "familyMembers": {
    "ui:widget": "textarea",
    "ui:options": {
      "rows": 5
    }
  },
  "bikes": {
    "ui:widget": "textarea",
    "ui:options": {
      "rows": 5
    }
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