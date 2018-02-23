import {observable, transaction, computed} from "mobx";

const recentItemsCount = 5;

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
		if (this._expenditures.length > recentItemsCount)
		{
			transaction(() =>
			{
				const oldItems = this._expenditures.reverse().filter((expenditure, index) =>
					index >= recentItemsCount && expenditure.synced);

				oldItems.forEach(oldItem => this._expenditures.remove(oldItem));
			});
		}

		localStorage.setItem("expenditures", JSON.stringify(this._expenditures));
	}
}
