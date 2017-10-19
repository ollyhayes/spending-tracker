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

//todo:
//	fix up psuedo code above
//	simplify account status


//no internet
//	accountManager.notConnected
//	7 items awaiting sync
//	click attempts init
//
//attempting init
//	accountManager.loading || sheetUpdater.attempingSync
//	sync status - loading -> status message: Cannot connect to server. -> 7 items awaiting sync
//
//display message
//	handle this stuff in the registerUpdate handler and have an overrige in the render body
//	accountManager.loading -> accountManager.notConnected
//	sheetUpdater.attemptingSync -> noConnection
//	sheetUpdater.attemptingSync -> synced
//
//no auth
//	accountManager.signedOut
//	sync status - sign to continue (link)
//
//authed/synced
//	else
//		sync status -> sync successful -> Synced with server
//
//
//
//	old:
//
//no internet
//	sync status - 7 items awaiting sync - click attempts init
//	account status - Nothing unless signed in
//
//	attempting init
//	sync status - loading -> status message: Cannot connect to server. -> 7 items awaiting sync
//	account status - Nothing unless signed in
//
//	no auth
//	sync status - sign to continue (link)
//	account status - Nothing unless signed in
//
//	authed/synced
//	sync status -> sync successful -> Synced with server
//	account status - Signed in as: Olly Hayes    Sign Out
