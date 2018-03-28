import {observable, computed} from "mobx";
import SpendingManager from "./spending-manager.js";
import Locker from "./locker.js";
import {default as SheetUpdater, status as syncStatus} from "./sheet-updater.js";
import {default as AccountManager, status as accountStatus} from "./account-manager.js";

export {accountStatus, syncStatus};

export default class Manager
{
	constructor(logger, settings)
	{
		this._spendingManager = new SpendingManager();
		this._accountManager = new AccountManager(logger);
		this._sheetUpdater = new SheetUpdater(logger);
		this._logger = logger;
		this._settings = settings;

		this._syncNumber = 0;

		this._locker = new Locker(() => this._sync());

		if (this._settings.autoSync)
			this._sync();
	}

	@computed get accountStatus() { return this._accountManager.status; }
	@computed get accountUsername() { return this._accountManager.username; }

	@computed get syncStatus() { return this._sheetUpdater.status; }
	@observable waitingToSyncUntil = null;

	@computed get numberOfItemsAwaitingSync() { return this._spendingManager.newExpenditures.length; }
	@computed get allExpenditures() { return this._spendingManager.allExpenditures; }

	signIn()
	{
		this._accountManager.signIn();
	}

	signOut()
	{
		this._accountManager.signOut();
	}

	addExpenditure(date, category, amount, description)
	{
		this._spendingManager.addExpenditure(date, category, amount, description);

		if (this._settings.autoSync)
			this._sync();
	}

	syncNow()
	{
		if (this._endWaiting)
			this._endWaiting(true);
		else
			this._sync(true);
	}

	cancelWaitingSync()
	{
		if (this._endWaiting)
			this._endWaiting(false);
	}

	async _sync(immediate = false)
	{
		const syncNumber = this._syncNumber++;
		const log = message => this._logger.log(`S${syncNumber} - ${message}`);

		log("Starting...");

		await this._locker.lock(async () =>
		{
			if (!await this._checkAccountStatus())
				return log("Not signed in - aborting");

			// check if spending tracker is open in other tabs and has other added expenditures
			this._spendingManager.syncWithLocalStorage();
			const newExpenditures = this._spendingManager.newExpenditures;

			if (newExpenditures.length === 0)
				return log("No new expenditures - aborting");

			// here we wait for a few seconds to see if there are any more expenditures
			if (!immediate && !await this._waitToCheckForCancel(log))
				return log("Cancelled - aborting");

			log(`Attempting sync - ${newExpenditures.length} expenditures`);
			const success = await this._sheetUpdater.trySync(newExpenditures, this._accountManager.getAccessToken());

			if (success)
			{
				log("Sync succeded");
				this._spendingManager.markExpendituresSynced(newExpenditures);
			}
			else
				log("Sync failed");
		},
		log);
	}

	async _checkAccountStatus()
	{
		if (this.accountStatus === accountStatus.notConnected)
			await this._accountManager.initialise();

		return this.accountStatus === accountStatus.signedIn;
	}

	_waitToCheckForCancel(log)
	{
		return new Promise(resolve =>
		{
			const waitTime = 3000;

			log("Starting timout - 3 seconds");
			let timeoutId = setTimeout(() => 
			{
				log("timeout reached, continuing");
				this._endWaiting = null;
				this.waitingToSyncUntil = null;
				resolve(true);
			},
			waitTime);

			this.waitingToSyncUntil = new Date().getTime() + waitTime;

			this._endWaiting = proceed =>
			{
				log(`manual intervention, ${proceed ? "proceeding with" : "cancelling"} sync`);
				clearTimeout(timeoutId);
				this._endWaiting = null;
				this.waitingToSyncUntil = null;
				resolve(proceed);
			};
		});
	}
}
