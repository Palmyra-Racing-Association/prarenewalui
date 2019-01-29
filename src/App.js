import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Form from "react-jsonschema-form";
import schema from './schemas/FormSchema';
import axios from 'axios';
import Env from './Env';
import Processing_Please_Wait from './Processing_Please_Wait.gif';

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
export default class App extends React.Component {
 
  async componentWillMount() {
    let memberResponse = await axios.get(apiUrl+'/members/'+token);
    let data = memberResponse.data;
    formData.lastName = data.last_name;
    formData.firstName = data.first_name;
    formData.email = data.email;
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
      <div>
        Please <a target="new" href="http://www.palmyramx.com/wordpress/wp-content/uploads/2017/02/PRA-Rules-And-Sound.pdf">click here to read the rules </a> 
        before submitting your acknowledgement if you have any questions on the rules.  Note that all rules are subject to change.
        <p/>
      </div>
      <div>
        <button id="submitBtn" type="submit" className="btn btn-info">Submit</button>
      </div>
      <div id="loading">
        <img src={Processing_Please_Wait} alt="loading"></img>
      </div>
      <div id="submitted">
        Thanks for submitting your renewal!  You should be all set, just send your payment per the 
        instructions in email!
      </div>
    </Form>
    );
  }
}