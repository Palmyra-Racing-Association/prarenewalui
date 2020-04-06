import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Renew from "./Renew"
import FamilyAndBikes from "./FamilyAndBikes";
export default class App extends React.Component { 

	render() {
		return (
		<div>
			<Router>
				<Switch>
					<Route path="/familyAndBikes">
						<FamilyAndBikes/>
					</Route>
					<Route path="/">
						<FamilyAndBikes/>
					</Route>
				</Switch>
			</Router>
		</div>
		);
	}
}