import * as React from "react";
import InputForm from "./input-form.jsx";
import SyncStatus from "./sync-status.jsx";
import SettingsPage from "./settings-page.jsx";
import Icon from "./icon.jsx";
import {default as PageState, page} from "./page-state";
import {observer} from "mobx-react";
import {observable} from "mobx";
import DebugMessages from "./debug-messages.jsx";
import createEnum from "./enum.js";

const inputState = createEnum(
	"completed",
	"current",
	"next"
);

@observer
export default class Page extends React.Component
{
	@observable inputForms = [];

	constructor(props)
	{
		super();

		this.manager = props.manager;
		this.logger = props.logger;
		this.settings = props.settings;

		this.pageState = new PageState();
		this.inputForms = [
			{ sequenceNumber: 0, state: inputState.current },
			{ sequenceNumber: 1, state: inputState.next }
		];

		this.handleInputCompleted = this.handleInputCompleted.bind(this);
		this.handleToggleSettingsPageShown = this.handleToggleSettingsPageShown.bind(this);
	}

	handleInputCompleted(sequenceNumber)
	{
		this.inputForms = [
			{ sequenceNumber: sequenceNumber, state: inputState.completed },
			{ sequenceNumber: sequenceNumber + 1, state: inputState.current },
			{ sequenceNumber: sequenceNumber + 2, state: inputState.next }
		];
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
			return <DebugMessages logger={this.logger}/>;

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
				<SettingsPage pageState={this.pageState} manager={this.manager} settings={this.settings}/>
			</div>
			{
				this.inputForms.map(inputForm =>
					<div
						key={inputForm.sequenceNumber}
						className={
							"input-form-container" +
							(this.pageState.settingsShown ? " disabled" : "") +
							(this.settings.blurEffect ? " blur-animation" : "") +
							" " + inputForm.state}>
						<InputForm
							manager={this.manager}
							inputCompleted={() => this.handleInputCompleted(inputForm.sequenceNumber)}/>
					</div>)
			}
		</div>;
	}
}

