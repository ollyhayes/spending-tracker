import * as React from "react";
import {status as sheetsstatus} from "./sheet-updater";
import {status as accountstatus} from "./account-manager";

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
	}

	//handleSync()
	//{
	//	this.sheetUpdater.trySync(this.spendingManager.expenditures, this.accountManager.accessToken);
	//}

	_getStatus()
	{
		//if (temporaryMessage)
		//	return <span>{temporaryMessage}</span>;

		if (this.state.accountStatus == accountstatus.loading || this.state.sheetsUpdaterStatus == sheetsstatus.attemptingSync)
			return <span>Loading...</span>;

		if (this.state.accountStatus == accountstatus.signedOut)
			return <span>Sign in to continue...</span>; // make link

		if (this.state.numberOfItemsAwatingSync == 0)
			return <span>Synced with server</span>;

		return <span>{this.state.numberOfItemsAwaitingSync} items awaiting sync...</span>; // make link
	}

	render()
	{
		return <div className="sync-status">
			{ this._getStatus() }
		</div>;
	}
}
