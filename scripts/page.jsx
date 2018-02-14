import * as React from "react";
import InputForm from "./input-form.jsx";
import SyncStatus from "./sync-status.jsx";
import AccountStatus from "./account-status.jsx";
import AppCacheStatus from "./app-cache-status.jsx";
import SettingsPage from "./settings-page.jsx";
//import ExpenditureList from "./expenditure-list.jsx";

export default class Page extends React.Component
{
	constructor(props)
	{
		super();

		this.manager = props.manager;

		this.state = {
			settingsShown: false
		};

		this.handleToggleSettingsPageShown = this.handleToggleSettingsPageShown.bind(this);
	}

	handleToggleSettingsPageShown()
	{
		this.setState({settingsShown: !this.state.settingsShown});
	}

	render()
	{
		return <div>
			<div className="upper-status-section">
				<button className="settings-page-button" onClick={this.handleToggleSettingsPageShown}>
					{/*this.state.settingsShown ? "Hide Settings" : "Show Settings"*/}
					<svg className="icon">
						<use xlinkHref="svg-sprites/fa-solid.svg#cog"></use>
					</svg>
				</button>
				<SyncStatus manager={this.manager}/>
			</div>
			<div className={"settings-page-container" + (this.state.settingsShown ? "" : " hidden")}>
				<SettingsPage manager={this.manager} logger={this.manager.logger}/>
			</div>
			<InputForm manager={this.manager}/>
			<AccountStatus manager={this.manager}/>
		</div>;

		// <AppCacheStatus/>
		// leaving this out for now
		// <ExpenditureList spendingManager={this.spendingManager}/>
	}
}

