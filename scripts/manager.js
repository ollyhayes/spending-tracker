import {computed} from "mobx";
import SpendingManager from "./spending-manager.js";
import {default as SheetUpdater, status as syncStatus} from "./sheet-updater.js";
import {default as AccountManager, status as accountStatus} from "./account-manager.js";

export {accountStatus, syncStatus};

export default class Manager
{
	constructor(logger)
	{
		this._spendingManager = new SpendingManager();
		this._accountManager = new AccountManager(logger);
		this._sheetUpdater = new SheetUpdater();
		this._logger = logger;

		this._syncQueud = false;
		this._syncInProgress = false;
		this._syncNumber = 0;

		this.sync();
	}

	@computed get accountStatus() { return this._accountManager.status; }
	@computed get accountUsername() { return this._accountManager.username; }

	@computed get syncStatus() { return this._sheetUpdater.status; }

	@computed get numberOfItemsAwaitingSync() { return this._spendingManager.expenditures.length; }

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

		this.sync();
	}

	async sync()
	{
		const syncNumber = this._syncNumber++;
		const log = message => this._logger.log(`S${syncNumber} - ${message}`);

		log("Starting...");

		if (this._syncInProgress)
		{
			log("Sync in progress - queueing");
			this._syncQueued = true;
			return;
		}

		this._syncInProgress = true;

		try
		{
			if (this.accountStatus === accountStatus.notConnected)
				await this._accountManager.initialise();

			if (this.accountStatus !== accountStatus.signedIn)
			{
				log("Not signed in - aborting");
				return;
			}

			const currentExpenditures = this._spendingManager.expenditures.slice();

			if (currentExpenditures.length === 0)
			{
				log("No new expenditures - aborting");
				return;
			}

			log(`Attempting sync - ${currentExpenditures.length} expenditures`);

			const success = await this._sheetUpdater.trySync(currentExpenditures, this._accountManager.getAccessToken());

			if (success)
			{
				log("Sync succeded");
				this._spendingManager.markExpendituresAsSynced(currentExpenditures);
			}
			else
			{
				log("Sync failed");
			}
		}
		finally
		{
			this._syncInProgress = false;
		}

		if (this._syncQueued)
		{
			this._syncQueued = false;
			await this.sync();
		}
	}
}
