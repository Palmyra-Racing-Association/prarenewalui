import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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