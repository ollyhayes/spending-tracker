export default class SpendingManager
{
	constructor()
	{
		const expendituresJson = localStorage.getItem("expenditures");


		this.expenditures = expendituresJson
			? JSON.parse(expendituresJson)
			: [];
	}

	addExpenditure(date, category, amount, description)
	{
		this.expenditures.push({
			date: date,
			category: category,
			amount: amount,
			description: description
		});

		this.save();
	}

	save()
	{
		localStorage.setItem("expenditures", JSON.stringify(this.expenditures));
	}
}
