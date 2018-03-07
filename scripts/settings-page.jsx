import * as React from "react";
import {page} from "./page-state";
import AppCacheStatus from "./app-cache-status.jsx";
import ExpenditureList from "./expenditure-list.jsx";
import AccountStatus from "./account-status.jsx";
import SyncStatus from "./sync-status.jsx";

export default class SettingsPage extends React.Component
{
	constructor(props)
	{
		super(props);

		this.pageState = props.pageState;
		this.manager = props.manager;

		this.handleShowDebugMessages = this.handleShowDebugMessages.bind(this);
	}

	handleShowDebugMessages()
	{
		this.pageState.setPage(page.debugMessages);
	}

	render()
	{
		return <div className="settings-page">
			<ExpenditureList manager={this.manager}/>
			<div className="statuses">
				<label>Application version:</label>
				<AppCacheStatus/>
				<label>Sign in:</label>
				<AccountStatus manager={this.manager}/>
				<label>Sync status:</label>
				<SyncStatus manager={this.manager}/>
			</div>
			<div className="buttons">
				<button className="debug-button" onClick={this.handleShowDebugMessages}>Show debug log</button>
			</div>
		</div>;
	}
}
