import * as React from "react";
import {page} from "./page-state";
import AppCacheStatus from "./app-cache-status.jsx";
import ExpenditureList from "./expenditure-list.jsx";
import AccountStatus from "./account-status.jsx";
import SpendingStatus from "./spending-status.jsx";
import {observer} from "mobx-react";

@observer
export default class SettingsPage extends React.Component
{
	constructor(props)
	{
		super(props);

		this.pageState = props.pageState;
		this.manager = props.manager;
		this.settings = props.settings;

		this.handleShowDebugMessages = this.handleShowDebugMessages.bind(this);
		this.handleSettingChanged = this.handleSettingChanged.bind(this);
	}

	handleShowDebugMessages()
	{
		this.pageState.setPage(page.debugMessages);
	}

	handleSettingChanged(event)
	{
		this.settings[event.target.name] = event.target.checked;
	}

	render()
	{
		const settingsRow = (displayName, name) =>
			<React.Fragment>
				<label htmlFor={"setting_" + name}>{displayName + ":"}</label>
				<input
					type="checkbox"
					name={name}
					id={"setting_" + name}
					checked={this.settings[name]}
					onChange={this.handleSettingChanged}>
				</input>
			</React.Fragment>;

		return <div className="settings-page">
			<ExpenditureList manager={this.manager}/>
			<div className="statuses">
				<label>Sync status:</label>
				<SpendingStatus manager={this.manager}/>
				<label>Sign in:</label>
				<AccountStatus manager={this.manager}/>
				<label>Application version:</label>
				<AppCacheStatus/>
			</div>
			<div className="settings">
				{settingsRow("Blur effect", "blurEffect")}
				{settingsRow("Auto sync", "autoSync")}
			</div>
			<div className="buttons">
				<button className="debug-button" onClick={this.handleShowDebugMessages}>Show debug log</button>
			</div>
		</div>;
	}
}
