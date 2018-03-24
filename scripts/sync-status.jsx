import * as React from "react";
import {observer, observable} from "mobx-react";
import {accountStatus, syncStatus} from "./manager";

@observer
export default class SyncStatus extends React.Component
{
	//@observable waitTimeUntilSync = null;

	constructor(props)
	{
		super(props);

		this.manager = props.manager;

		this.handleSync = this.handleSync.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleSignIn = this.handleSignIn.bind(this);
	}

	handleSync()
	{
		this.manager.syncNow();
	}

	handleCancel()
	{
		this.manager.cancelWaitingSync();
	}

	handleSignIn()
	{
		this.manager.signIn();
	}

	_getStatus()
	{
		//if (temporaryMessage)
		//	return <span>{temporaryMessage}</span>;
		
		if (this.manager.waitingToSyncUntil)
			return <span className="neutral-message">
				<a href="javascript:void(0)" onClick={this.handleSync}>
					Sync
				</a> in {1}...  <a href="javascript:void(0)" onClick={this.handleCancel}> { /* wierd formatting to prevent spaces being lost */ }
					Cancel
				</a>
			</span>;

		if (this.manager.accountStatus === accountStatus.loading)
			return <span className="neutral-message">Loading...</span>;

		if (this.manager.syncStatus === syncStatus.uploadingData)
			return <span className="neutral-message">Uploading data...</span>;

		if (this.manager.syncStatus === syncStatus.processingSpreadsheet)
			return <span className="neutral-message">Processing spreadsheet...</span>;

		if (this.manager.accountStatus === accountStatus.signedOut)
			return <a className="neutral-message" href="javascript:void(0)" onClick={this.handleSignIn}>Sign in to continue...</a>;

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
