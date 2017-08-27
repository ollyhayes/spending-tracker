import * as React from "react";
import * as ReactDOM from "react-dom";
import InputForm from "./input-form.jsx";
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
		return <InputForm spendingManager={this.spendingManager}/>;
	}
}

document.addEventListener("DOMContentLoaded", () =>
{

	ReactDOM.render(
		<Content/>,
		document.querySelector("body > div"));
});
