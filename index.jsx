import * as React from "react";
import * as ReactDOM from "react-dom";
import InputForm from "./input-form.jsx";
//import ExpenditureList from "./expenditure-list.jsx";
import SpendingManager from "./spending-manager.js";

class Content extends React.Component
{
	constructor()
	{
		super();
		this.spendingManager = new SpendingManager();
	}

	render()
	{
		return <div>
			<header>Travel Expenses</header>
			<InputForm spendingManager={this.spendingManager}/>
		</div>;

		// leaving this out for now
		// <ExpenditureList spendingManager={this.spendingManager}/>
	}
}

document.addEventListener("DOMContentLoaded", () =>
{
	ReactDOM.render(
		<Content/>,
		document.querySelector("body > div"));
});
