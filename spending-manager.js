export default class SpendingManager
{
	constructor()
	{
		const expendituresJson = localStorage.getItem("expenditures");

		this.handlers = [];

		this.expenditures = expendituresJson
			? JSON.parse(expendituresJson)
			: [];

		// urgh, there must be a better way, but no internet at the moment
		this.expenditures.forEach(expenditure => expenditure.date = new Date(expenditure.date));
	}

	registerUpdate(handler)
	{
		this.handlers.push(handler);
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

	_save()
	{
		localStorage.setItem("expenditures", JSON.stringify(this.expenditures));
		this.handlers.forEach(handler => handler());
	}
}
