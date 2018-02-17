import * as React from "react";
import {page} from "./page-state";
import AppCacheStatus from "./app-cache-status.jsx";

export default class SettingsPage extends React.Component
{
	constructor(props)
	{
		super(props);

		this.pageState = props.pageState;

		this.handleShowDebugMessages = this.handleShowDebugMessages.bind(this);
	}

	handleShowDebugMessages()
	{
		this.pageState.setPage(page.debugMessages);
	}

	render()
	{
		return <div className="settings-page">
			<label className="cache-label">Cache Status:</label>
			<AppCacheStatus className="cache-value"/>
			<button className="debug-button" onClick={this.handleShowDebugMessages}>Show debug messages</button>
		</div>;
	}
}
