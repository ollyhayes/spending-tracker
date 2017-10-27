import {observable, computed} from "mobx";
import SpendingManager from "./spending-manager.js";
import {default as SheetUpdater, status as syncStatus} from "./sheet-updater.js";
import {default as AccountManager, status as accountStatus} from "./account-manager.js";

export {accountStatus, syncStatus};

export default class Manager
{
	constructor()
	{
		// move all this logic into a seperate multi manager, shouldn't be handled in the UI
		this.spendingManager = new SpendingManager();
		this.accountManager = new AccountManager();
		this.sheetUpdater = new SheetUpdater();

		let syncQueued = false;

		// this.spendingManager.registerUpdate(() =>
		// {
		// 	if (this.spendingManager.expenditures.length === 0 || this.accountManager.status !== accountStatus.signedIn)
		// 		return;

		// 	if (this.sheetUpdater.status === syncStatus.attemptingSync)
		// 		syncQueued = true;
		// 	else
		// 		this.sheetUpdater.trySync(this.spendingManager.expenditures, this.accountManager.accessToken);
		// });

		// this.sheetUpdater.registerUpdate(status =>
		// {
		// 	if (status === syncStatus.synced)
		// 		this.spendingManager.clearExpenditures(); // if more synces were made this could remove old ones

		// 	if (syncQueued)
		// 	{
		// 		syncQueued = false;
		// 		this.sheetUpdater.trySync(this.spendingManager.expenditures, this.accountManager.accessToken);
		// 	}
		// });

		this.accountManager.initialise();

		window.accountManager = this.accountManager;
		window.sheetUpdater = this.sheetUpdater;
	}

	@computed get accountStatus() { return this.accountManager.status; }
	@computed get accountUsername() { return this.accountManager.username; }

	@computed get syncStatus() { return this.sheetUpdater.status; }

	@computed get numberOfItemsAwaitingSync() { return this.spendingManager.expenditures.length; }

	signIn()
	{
		this.accountManager.signIn();
	}

	signOut()
	{
		this.accountManager.signOut();
	}

	addExpenditure(date, category, amount, description)
	{
		this.spendingManager.addExpenditure(date, category, amount, description);
	}

	async sync()
	{
		if (this.accountStatus === accountStatus.notConnected)
			await this.accountManager.initialise();

		if (this.accountStatus === accountStatus.signedIn)
			this.sheetUpdater.trySync(this.spendingManager.expenditures, this.accountManager.accessToken);
	}
}
