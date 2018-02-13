import * as React from "react";

export default class SettingsPage extends React.Component
{
	constructor(props)
	{
		super(props);
	}

	render()
	{
		return <div className="settings-page">
			<button>Show debug messages</button>
		</div>;
	}
}
