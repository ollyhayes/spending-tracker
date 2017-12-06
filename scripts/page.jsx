import * as React from "react";
import InputForm from "./input-form.jsx";
import SyncStatus from "./sync-status.jsx";
import AccountStatus from "./account-status.jsx";
import AppCacheStatus from "./app-cache-status.jsx";
//import ExpenditureList from "./expenditure-list.jsx";

export default class Page extends React.Component
{
	constructor(props)
	{
		super();

		this.manager = props.manager;
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

