import {computed} from "mobx";
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
		this._sheetUpdater = new SheetUpdater();
		this._logger = logger;
		this._settings = settings;

		this._syncNumber = 0;

		this._locker = new Locker(() => this.sync());

		if (this._settings.autoSync)
			this.sync();
	}

	@computed get accountStatus() { return this._accountManager.status; }
	@computed get accountUsername() { return this._accountManager.username; }

	@computed get syncStatus() { return this._sheetUpdater.status; }

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
			this.sync();
	}

	async sync()
	{
		const syncNumber = this._syncNumber++;
		const log = message => this._logger.log(`S${syncNumber} - ${message}`);

		log("Starting...");

		await this._locker.lock(async () =>
		{
			if (this.accountStatus === accountStatus.notConnected)
				await this._accountManager.initialise();

			if (this.accountStatus !== accountStatus.signedIn)
			{
				log("Not signed in - aborting");
				return;
			}

			// check if other spending tracker is open in other tabs and has other added expenditures
			this._spendingManager.syncWithLocalStorage();
			const newExpenditures = this._spendingManager.newExpenditures;

			if (newExpenditures.length === 0)
			{
				log("No new expenditures - aborting");
				return;
			}

			log(`Attempting sync - ${newExpenditures.length} expenditures`);

			const success = await this._sheetUpdater.trySync(newExpenditures, this._accountManager.getAccessToken());

			if (success)
			{
				log("Sync succeded");
				this._spendingManager.markExpendituresSynced(newExpenditures);
			}
			else
			{
				log("Sync failed");
			}
		},
		log);
	}
}
