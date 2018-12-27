import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Form from "react-jsonschema-form";
import schema from './schemas/FormSchema';

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
  }
};

let formData = {
}

let data = {}

let token = window.location.pathname.replace(/\//g, "");

const log = (type) => console.log.bind(console, type);

export default class App extends React.Component {

  async componentWillMount() {
    let memberResponse = await fetch('http://localhost:8000/members/'+token);
    data = await memberResponse.json();
    formData.lastName = data.last_name;
    formData.firstName = data.first_name;
    formData.email = data.email;
    formData["agreement"] = formData.firstName + " " + formData.lastName + " ";
    console.log(formData);  
    this.setState({formData});
  }
  render() { 
    return (
    <Form schema={schema} uiSchema={uischema} formData={formData}
        onChange={log("changed")}
        onSubmit={log("submitted")}
        onError={log("errors")} />
    );
  }
}