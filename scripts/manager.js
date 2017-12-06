import {computed} from "mobx";
import SpendingManager from "./spending-manager.js";
import {default as SheetUpdater, status as syncStatus} from "./sheet-updater.js";
import {default as AccountManager, status as accountStatus} from "./account-manager.js";

export {accountStatus, syncStatus};

export default class Manager
{
	constructor(logger)
	{
		this.spendingManager = new SpendingManager();
		this.accountManager = new AccountManager(logger);
		this.sheetUpdater = new SheetUpdater();
		this.logger = logger;

		this.syncQueud = false;
		this.syncInProgress = false;
		this.syncNumber = 0;

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
		const syncNumber = this.syncNumber++;
		const log = message => this.logger.log(`S${syncNumber} - ${message}`);

		log("Starting...");

		if (this.syncInProgress)
		{
			log("Sync in progress - queueing");
			this.syncQueued = true;
			return;
		}

		this.syncInProgress = true;

		try
		{
			if (this.accountStatus === accountStatus.notConnected)
				await this.accountManager.initialise();

			if (this.accountStatus !== accountStatus.signedIn)
			{
				log("Not signed in - aborting");
				return;
			}

			const currentExpenditures = this.spendingManager.expenditures.slice();

			if (currentExpenditures.length === 0)
			{
				log("No new expenditures - aborting");
				return;
			}

			log(`Attempting sync - ${currentExpenditures.length} expenditures`);

			const success = await this.sheetUpdater.trySync(currentExpenditures, this.accountManager.getAccessToken());

			if (success)
			{
				log("Sync succeded");
				this.spendingManager.clearExpenditures(currentExpenditures);
			}
			else
			{
				log("Sync failed");
			}
		}
		finally
		{
			this.syncInProgress = false;
		}

		if (this.syncQueued)
		{
			this.syncQueued = false;
			await this.sync();
		}
	}
}
