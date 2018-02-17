import * as React from "react";
import {page} from "./page-state";

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
			<button onClick={this.handleShowDebugMessages}>Show debug messages</button>
		</div>;
	}
}
