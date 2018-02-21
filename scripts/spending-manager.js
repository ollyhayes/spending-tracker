import {observable, transaction, computed} from "mobx";

export default class SpendingManager
{
	@observable
	_expenditures = [];

	constructor()
	{
		const expendituresJson = localStorage.getItem("expenditures");

		this._expenditures = expendituresJson
			? JSON.parse(expendituresJson)
			: [];

		// urgh, there must be a better way, but no internet at the moment
		this._expenditures.forEach(expenditure => expenditure.date = new Date(expenditure.date));
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

		this._save();
	}

	markExpendituresSynced(expenditures)
	{
		transaction(() =>
		{
			expenditures.forEach(expenditure =>
				expenditure.synced = true);
		});

		this._save();
	}

	_save()
	{
		if (this._expenditures.length > 10)
		{
			transaction(() =>
			{
				const oldItems = this._expenditures.filter((expenditure, index) =>
					index > 9 && expenditure.synced);

				oldItems.forEach(this._expenditures.remove);
			});
		}

		localStorage.setItem("expenditures", JSON.stringify(this._expenditures));
	}
}
