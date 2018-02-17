import * as React from "react";
import InputForm from "./input-form.jsx";
import SyncStatus from "./sync-status.jsx";
import AccountStatus from "./account-status.jsx";
import SettingsPage from "./settings-page.jsx";
import Icon from "./icon.jsx";
//import ExpenditureList from "./expenditure-list.jsx";
import {default as PageState, page} from "./page-state";
import {observer} from "mobx-react";
import DebugMessages from "./debug-messages.jsx";

@observer
export default class Page extends React.Component
{
	constructor(props)
	{
		super();

		this.manager = props.manager;

		this.pageState = new PageState();

		this.handleToggleSettingsPageShown = this.handleToggleSettingsPageShown.bind(this);
	}

	handleToggleSettingsPageShown()
	{
		this.pageState.setPage(
			this.pageState.settingsShown
				? page.main
				: page.settings);
	}

	render()
	{
		if (this.pageState.debugMessagesShown)
			return <DebugMessages logger={this.manager.logger}/>;

		return <div>
			<div className="upper-status-section">
				<button
					className={"settings-page-button" + (this.pageState.settingsShown ? " selected" : "")}
					onClick={this.handleToggleSettingsPageShown}>
					<Icon iconName="cog"/>
				</button>
				<SyncStatus manager={this.manager}/>
			</div>
			<div className={"settings-page-container" + (this.pageState.settingsShown ? "" : " hidden")}>
				<SettingsPage pageState={this.pageState}/>
			</div>
			<InputForm manager={this.manager}/>
			<AccountStatus manager={this.manager}/>
		</div>;

		// <AppCacheStatus/>
		// leaving this out for now
		// <ExpenditureList spendingManager={this.spendingManager}/>
	}
}

