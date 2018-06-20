import {observable, transaction, computed} from "mobx";

const recentItemsCount = 5;

export default class SpendingManager
{
	@observable
	_expenditures = [];

	constructor()
	{
		this.loadFromStorage();
	}

	@computed get newExpenditures() { return this._expenditures.filter(expenditure => !expenditure.synced); }
	@computed get allExpenditures() { return this._expenditures.slice(); }

	addExpenditure(date, category, amount, description)
	{
		transaction(() =>
		{
			this.loadFromStorage();

			this._expenditures.push({
				date: date,
				category: category,
				amount: amount,
				description: description,
				synced: false
			});

			this.saveToStorage();
		});
	}

	markExpendituresSyncedSince(syncTime)
	{
		transaction(() =>
		{
			this.loadFromStorage();

			this._expenditures.forEach(expenditure =>
			{
				if (expenditure.date < syncTime)
					expenditure.synced = true;
			});

			this.saveToStorage();
		});
	}

	loadFromStorage()
	{
		const expendituresJson = localStorage.getItem("expenditures");

		const expenditures = expendituresJson
			? JSON.parse(expendituresJson)
			: [];

		// urgh, there must be a better way, but no internet at the moment
		expenditures.forEach(expenditure => expenditure.date = new Date(expenditure.date));

		this._expenditures = expenditures;
	}

	saveToStorage()
	{
		const recentIndexCutoff = this._expenditures.length - recentItemsCount;

		this._expenditures = this._expenditures
			.filter((expenditure, index) => 
				!expenditure.synced || index >= recentIndexCutoff);

		localStorage.setItem("expenditures", JSON.stringify(this._expenditures));
	}
}
