import * as React from "react";
import * as ReactDOM from "react-dom";
import InputForm from "./input-form.jsx";
import SyncStatus from "./sync-status.jsx";
import AccountStatus from "./account-status.jsx";
import AppCacheStatus from "./app-cache-status.jsx";
//import ExpenditureList from "./expenditure-list.jsx";
import Manager from "./manager";

class Content extends React.Component
{
	constructor()
	{
		super();

		this.manager = new Manager();
	}

	render()
	{
		return <div>
			<div className="upper-status-section">
				<AppCacheStatus/>
				<SyncStatus manager={this.manager}/>
			</div>
			<InputForm manager={this.manager}/>
			<AccountStatus manager={this.manager}/>
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
