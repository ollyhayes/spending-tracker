import {observable, transaction, computed} from "mobx";

const recentItemsCount = 5;

export default class SpendingManager
{
	@observable
	_expenditures = [];

	constructor()
	{
		this.syncWithLocalStorage();
	}

	@computed get newExpenditures() { return this._expenditures.filter(expenditure => !expenditure.synced); }
	@computed get allExpenditures() { return this._expenditures.slice(); }

	addExpenditure(date, category, amount, description)
	{
		this._expenditures.push({
			date: date,
			category: category,
			amount: amount,
			description: description,
			synced: false
		});

		this.syncWithLocalStorage();
	}

	markExpendituresSynced(expenditures)
	{
		transaction(() =>
		{
			expenditures.forEach(expenditure =>
				expenditure.synced = true);
		});

		this.syncWithLocalStorage();
	}

	syncWithLocalStorage()
	{
		const storedExpendituresJson = localStorage.getItem("expenditures");

		const storedExpenditures = storedExpendituresJson
			? JSON.parse(storedExpendituresJson)
			: [];

		// urgh, there must be a better way, but no internet at the moment
		storedExpenditures.forEach(expenditure => expenditure.date = new Date(expenditure.date));

		const uniqueExpenditures = storedExpenditures
			.concat(this._expenditures.slice()) // create copy - concat doesn't work with mobx arrays
			.reduce(
				(uniqueExpenditures, next) =>
				{
					const alreadyAddedExpenditure = uniqueExpenditures.find(expenditure =>
						expenditure.date.getTime() === next.date.getTime());

					if (alreadyAddedExpenditure)
						alreadyAddedExpenditure.synced = alreadyAddedExpenditure.synced || next.synced;

					return alreadyAddedExpenditure
						? uniqueExpenditures
						: uniqueExpenditures.concat(next);
				},
				[]);

		const recentIndexCutoff = uniqueExpenditures.length - recentItemsCount;

		const recentUniqueExpenditures = uniqueExpenditures
			.filter((expenditure, index) => 
				!expenditure.synced || index >= recentIndexCutoff);

		this._expenditures = recentUniqueExpenditures;
		localStorage.setItem("expenditures", JSON.stringify(this._expenditures));
	}
}
