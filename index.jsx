import * as React from "react";
import * as ReactDOM from "react-dom";
import InputForm from "./input-form.jsx";
import SyncStatus from "./sync-status.jsx";
import AccountStatus from "./account-status.jsx";
//import ExpenditureList from "./expenditure-list.jsx";
import SpendingManager from "./spending-manager.js";
import SheetUpdater from "./sheet-updater.js";
import AccountManager from "./account-manager.js";

class Content extends React.Component
{
	constructor()
	{
		super();

		this.spendingManager = new SpendingManager();
		this.accountManager = new AccountManager();
		this.sheetUpdater = new SheetUpdater(this.accountManager);

		this.spendingManager.registerUpdate(() =>
			this.sheetUpdater.trySync(this.spendingManager.expenditures));

		this.sheetUpdater.registerUpdate(status =>
		{
			if (status === this.sheetUpdater.statuses.synced)
				this.spendingManager.clearExpenditures();
		});

		this.accountManager.initialise();
	}

	render()
	{
		return <div>
			<SyncStatus spendingManager={this.spendingManager} sheetUpdater={this.sheetUpdater}/>
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
