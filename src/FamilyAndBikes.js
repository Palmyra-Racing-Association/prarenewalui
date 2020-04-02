import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './FamilyAndBikes.css';
import Form from "react-jsonschema-form";
import schema from './schemas/FamilyAndBikes';
import axios from 'axios';
import Env from './Env';

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
  "token": {
    "ui:widget": "hidden"
  },
  "fixedItemsList": {
    "items": [
      {
        "ui:widget": "textarea"
      },
      {
        "ui:widget": "select"
      }
    ],
    "additionalItems": {
      "ui:widget": "updown"
    }
  },  
};
const apiUrl = Env.api_url;

let formData = {
}

let token = window.location.search.replace(/\?token=/g, "");

const onSubmit = ({formData}) => {
  console.log("Data submitted: ",  formData);
  document.getElementById("submitBtn").disabled = true;
  document.getElementById("loading").style.visibility = "visible";
  axios.post(apiUrl+'/members/renew/', {
    token: token,
    insCopy: formData.insuranceCapture
  })
  .then(function (response) {
    console.log(response);
    document.getElementById("loading").style.visibility = "hidden";
    document.getElementById("submitted").style.visibility= "visible" ;
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
    formData["agreement"] = formData.firstName + " " + formData.lastName + " ";
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

    </Form>
    );
  }
}