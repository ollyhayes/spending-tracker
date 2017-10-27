import * as React from "react";
import {observer} from "mobx-react";
import {accountStatus, syncStatus} from "./manager";

@observer
export default class SyncStatus extends React.Component
{
	constructor(props)
	{
		super(props);

		this.manager = props.manager;

		this.handleSync = this.handleSync.bind(this);
		this.handleSignIn = this.handleSignIn.bind(this);
	}

	async handleSync()
	{
		if (this.manager.accountStatus === accountStatus.notConnected)
			await this.manager.accountManager.initialise();

		if (this.manager.accountStatus === accountStatus.signedIn)
			this.manager.sheetUpdater.trySync(this.manager.spendingManager.expenditures, this.manager.accountManager.accessToken);
	}

	async handleSignIn()
	{
		this.manager.accountManager.signIn();
	}

	_getStatus()
	{
		//if (temporaryMessage)
		//	return <span>{temporaryMessage}</span>;

		if (this.manager.accountStatus === accountStatus.loading
			|| this.manager.syncStatus === syncStatus.attemptingSync)
			return <span>Loading...</span>;

		if (this.manager.accountStatus === accountStatus.signedOut)
			return <a href="javascript:void(0)" onClick={this.handleSignIn}>Sign in to continue...</a>;

		if (this.manager.numberOfItemsAwaitingSync === 0)
			return <span className="sync">Synced with server</span>;

		return <a className="no-sync" href="javascript:void(0)" onClick={this.handleSync}>{this.manager.numberOfItemsAwaitingSync} items awaiting sync...</a>;
	}

	render()
	{
		return <div className="sync-status">
			{ this._getStatus() }
		</div>;
	}
}
