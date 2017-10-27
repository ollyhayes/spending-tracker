import * as React from "react";
import * as ReactDOM from "react-dom";
import InputForm from "./input-form.jsx";
import SyncStatus from "./sync-status.jsx";
import AccountStatus from "./account-status.jsx";
//import ExpenditureList from "./expenditure-list.jsx";
import SpendingManager from "./spending-manager.js";
import {default as SheetUpdater, status as syncStatus} from "./sheet-updater.js";
import {default as AccountManager, status as accountStatus} from "./account-manager.js";

class Content extends React.Component
{
	constructor()
	{
		super();

		// move all this logic into a seperate multi manager, shouldn't be handled in the UI
		this.spendingManager = new SpendingManager();
		this.accountManager = new AccountManager();
		this.sheetUpdater = new SheetUpdater();

		let syncQueued = false;

		this.spendingManager.registerUpdate(() =>
		{
			if (this.spendingManager.expenditures.length === 0 || this.accountManager.status !== accountStatus.signedIn)
				return;

			if (this.sheetUpdater.status === syncStatus.attemptingSync)
				syncQueued = true;
			else
				this.sheetUpdater.trySync(this.spendingManager.expenditures, this.accountManager.accessToken);
		});

		this.sheetUpdater.registerUpdate(status =>
		{
			if (status === syncStatus.synced)
				this.spendingManager.clearExpenditures(); // if more synces were made this could remove old ones

			if (syncQueued)
			{
				syncQueued = false;
				this.sheetUpdater.trySync(this.spendingManager.expenditures, this.accountManager.accessToken);
			}
		});

		this.accountManager.initialise();
	}

	render()
	{
		return <div>
			<SyncStatus
				spendingManager={this.spendingManager}
				sheetUpdater={this.sheetUpdater}
				accountManager={this.accountManager}/>
			<InputForm spendingManager={this.spendingManager}/>
			<AccountStatus accountManager={this.accountManager}/>
		</div>;

		// leaving this out for now
		// <ExpenditureList spendingManager={this.spendingManager}/>
	}
}

document.addEventListener("DOMContentLoaded", () =>
{
	ReactDOM.render(
		<Content/>,
		document.querySelector("body > div"));
});
