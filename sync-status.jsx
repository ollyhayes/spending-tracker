import * as React from "react";
import {status as sheetsstatus} from "./sheet-updater";
import {status as accountStatus} from "./account-manager";

export default class SyncStatus extends React.Component
{
	constructor(props)
	{
		super(props);

		this.spendingManager = props.spendingManager;
		this.sheetUpdater = props.sheetUpdater;
		this.accountManager = props.accountManager;

		this.spendingManager.registerUpdate(() =>
			this.setState({numberOfItemsAwaitingSync: this.spendingManager.expenditures.length}));

		this.sheetUpdater.registerUpdate(status =>
			this.setState({syncStatus: status}));

		this.accountManager.registerUpdate(() =>
			this.setState({accountStatus: this.accountManager.status}));

		this.state = {
			accountStatus: this.accountManager.status,
			sheetsUpdaterStatus: this.sheetUpdater.status,
			numberOfItemsAwaitingSync: this.spendingManager.expenditures.length
		};

		this.handleSync = this.handleSync.bind(this);
		this.handleSignIn = this.handleSignIn.bind(this);
	}

	async handleSync()
	{
		if (this.state.accountStatus == accountStatus.notConnected)
			await this.accountManager.initialise();

		if (this.state.accountStatus == accountStatus.signedIn)
			this.sheetUpdater.trySync(this.spendingManager.expenditures, this.accountManager.accessToken);
	}

	async handleSignIn()
	{
		this.accountManager.signIn();
	}

	_getStatus()
	{
		//if (temporaryMessage)
		//	return <span>{temporaryMessage}</span>;

		if (this.state.accountStatus == accountStatus.loading || this.state.sheetsUpdaterStatus == sheetsstatus.attemptingSync)
			return <span>Loading...</span>;

		if (this.state.accountStatus == accountStatus.signedOut)
			return <a href="javascript:void(0)" onClick={this.handleSignIn}>Sign in to continue...</a>;

		if (this.state.numberOfItemsAwatingSync == 0)
			return <span className="sync">Synced with server</span>;

		return <a className="no-sync" href="javascript:void(0)" onClick={this.handleSync}>{this.state.numberOfItemsAwaitingSync} items awaiting sync...</a>;
	}

	render()
	{
		return <div className="sync-status">
			{ this._getStatus() }
		</div>;
	}
}
