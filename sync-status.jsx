import * as React from "react";
import {observer} from "mobx-react";
import {status as sheetsstatus} from "./sheet-updater";
import {status as accountStatus} from "./account-manager";

@observer
export default class SyncStatus extends React.Component
{
	constructor(props)
	{
		super(props);

		this.manager = props.manager;

		this.manager.spendingManager.registerUpdate(() =>
			this.setState({numberOfItemsAwaitingSync: this.spendingManager.expenditures.length}));

		this.manager.sheetUpdater.registerUpdate(status =>
			this.setState({sheetsUpdaterStatus: status}));

		// this.manager.accountManager.registerUpdate(() =>
		// 	this.setState({accountStatus: this.accountManager.status}));

		this.state = {
			sheetsUpdaterStatus: this.manager.sheetUpdater.status,
			numberOfItemsAwaitingSync: this.manager.spendingManager.expenditures.length
		};

		this.handleSync = this.handleSync.bind(this);
		this.handleSignIn = this.handleSignIn.bind(this);
	}

	async handleSync()
	{
		if (this.manager.accountManager.status === accountStatus.notConnected)
			await this.accountManager.initialise();

		if (this.manager.accountManager.status === accountStatus.signedIn)
			this.sheetUpdater.trySync(this.spendingManager.expenditures, this.accountManager.accessToken);
	}

	async handleSignIn()
	{
		this.manager.accountManager.signIn();
	}

	_getStatus()
	{
		//if (temporaryMessage)
		//	return <span>{temporaryMessage}</span>;

		if (this.manager.accountManager.status === accountStatus.loading || this.state.sheetsUpdaterStatus === sheetsstatus.attemptingSync)
			return <span>Loading...</span>;

		if (this.manager.accountManager.status === accountStatus.signedOut)
			return <a href="javascript:void(0)" onClick={this.handleSignIn}>Sign in to continue...</a>;

		if (this.state.numberOfItemsAwaitingSync === 0)
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
