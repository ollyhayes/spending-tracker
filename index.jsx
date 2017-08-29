import * as React from "react";
import * as ReactDOM from "react-dom";
import InputForm from "./input-form.jsx";
import ExpenditureList from "./expenditure-list.jsx";
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
			<ExpenditureList spendingManager={this.spendingManager}/>
		</div>;
	}
}

document.addEventListener("DOMContentLoaded", () =>
{
	ReactDOM.render(
		<Content/>,
		document.querySelector("body > div"));
});
