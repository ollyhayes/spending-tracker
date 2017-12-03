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
			description: description
		});

		this._save();
	}

	clearExpenditures(expenditures)
	{
		transaction(() =>
			expenditures.forEach(expenditure =>
				this.expenditures.remove(expenditure)));

		this._save();
	}

	_save()
	{
		localStorage.setItem("expenditures", JSON.stringify(this.expenditures));
	}
}
