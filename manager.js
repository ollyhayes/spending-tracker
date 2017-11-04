import {observable, computed} from "mobx";
import SpendingManager from "./spending-manager.js";
import {default as SheetUpdater, status as syncStatus} from "./sheet-updater.js";
import {default as AccountManager, status as accountStatus} from "./account-manager.js";

export {accountStatus, syncStatus};

export default class Manager
{
	constructor()
	{
		this.spendingManager = new SpendingManager();
		this.accountManager = new AccountManager();
		this.sheetUpdater = new SheetUpdater();

		this.syncQueud = false;
		this.syncInProgress = false;

		this.sync();
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

		this.sync();
	}

	async sync()
	{
		if (this.syncInProgress)
		{
			this.syncQueued = true;
			return;
		}

		this.syncInProgress = true;

		if (this.accountStatus === accountStatus.notConnected)
			await this.accountManager.initialise();

		if (this.accountStatus !== accountStatus.signedIn)
			return;

		const currentExpenditures = this.spendingManager.expenditures.slice();
		const success = await this.sheetUpdater.trySync(currentExpenditures, this.accountManager.accessToken);

		if (success)
			this.spendingManager.clearExpenditures(currentExpenditures);

		this.syncInProgress = false;

		if (this.syncQueued)
		{
			this.syncQueued = false;
			await this.sync();
		}
	}
}
