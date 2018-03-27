import * as React from "react";
import {observer} from "mobx-react";
import {observable, observe} from "mobx";
import {accountStatus, syncStatus} from "./manager";

@observer
export default class SyncStatus extends React.Component
{
	@observable secondsUntilSync = null;

	constructor(props)
	{
		super(props);

		this.manager = props.manager;

		this.handleSync = this.handleSync.bind(this);
		this.handleSignIn = this.handleSignIn.bind(this);

		// not sure if I'm keeping all this waitingToSync stuff, it's a bit complicated,
		// might move all this to it's own class if I do.
		observe(this.manager, "waitingToSyncUntil", ({newValue}) =>
		{
			if (newValue)
			{
				const updateSeconds = () =>
				{
					newValue = this.manager.waitingToSyncUntil;

					const secondsUntilSync = Math.round((newValue - new Date().getTime()) / 1000);

					if (newValue && secondsUntilSync > 0)
					{
						this.secondsUntilSync = secondsUntilSync;
					}
					else
					{
						clearInterval(intervalId);
						this.secondsUntilSync = null;
					}
				};

				const intervalId = setInterval(updateSeconds, 1000);
				updateSeconds();
			}
			else
				this.secondsUntilSync = null;
		}, true);
	}

	handleSync()
	{
		this.manager.syncNow();
	}

	handleSignIn()
	{
		this.manager.signIn();
	}

	_getStatus()
	{
		//if (temporaryMessage)
		//	return <span>{temporaryMessage}</span>;

		if (this.manager.accountStatus === accountStatus.loading)
			return <span className="neutral-message">Loading...</span>;

		if (this.manager.syncStatus === syncStatus.uploadingData)
			return <span className="neutral-message">Uploading data...</span>;

		if (this.manager.syncStatus === syncStatus.processingSpreadsheet)
			return <span className="neutral-message">Processing spreadsheet...</span>;

		if (this.manager.accountStatus === accountStatus.signedOut)
			return <a className="neutral-message" href="javascript:void(0)" onClick={this.handleSignIn}>Sign in to continue...</a>;
		
		if (this.secondsUntilSync)
			return <span className="neutral-message">
				<a href="javascript:void(0)" className="neutral-message" onClick={this.handleSync}>
					Sync
				</a> in {this.secondsUntilSync}...
			</span>;

		if (this.manager.numberOfItemsAwaitingSync === 0)
			return <span className="good-message">Synced with server</span>;

		return <a className="bad-message" href="javascript:void(0)" onClick={this.handleSync}>{this.manager.numberOfItemsAwaitingSync} items awaiting sync...</a>;
	}

	render()
	{
		return <div className="sync-status">
			{ this._getStatus() }
		</div>;
	}
}
