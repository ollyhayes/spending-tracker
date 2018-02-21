import {observable, transaction} from "mobx";

export default class SpendingManager
{
	@observable
	expenditures = [];

	constructor()
	{
		const expendituresJson = localStorage.getItem("expenditures");

		this.expenditures = expendituresJson
			? JSON.parse(expendituresJson)
			: [];

		// urgh, there must be a better way, but no internet at the moment
		this.expenditures.forEach(expenditure => expenditure.date = new Date(expenditure.date));
	}

	addExpenditure(date, category, amount, description)
	{
		this.expenditures.push({
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
		if (this.expenditures.length > 10)
		{
			transaction(() =>
			{
				const oldItems = this.expenditures.filter((expenditure, index) =>
					index > 9 && expenditure.synced);

				oldItems.forEach(this.expenditures.remove);
			});
		}

		localStorage.setItem("expenditures", JSON.stringify(this.expenditures));

		window.expenditures = this.expenditures.slice();
	}
}
