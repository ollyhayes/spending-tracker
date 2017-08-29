import * as React from "react";

export default class InputForm extends React.Component
{
	constructor(props)
	{
		super(props);

		this.spendingManager = props.spendingManager;

		this.state = {
			description: "",
			amount: "",
			category: ""
		};

		this.groupedCategories = [
			[
				"Food - Breakfast",
				"Food - Lunch",
				"Food - Dinner",
				"Food"
			],
			[
				"Drinks - Soft",
				"Drinks - Alcoholic"
			],
			[
				"Sights",
				"Transport",
				"Laundry",
				"Medical"
			],
			[
				"Technology",
				"Clothing",
				"Other"
			]
		];

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event)
	{
		this.setState({[event.target.name]: event.target.value});
	}

	handleSubmit(event)
	{
		event.preventDefault();
		console.log(`Submitting: category - ${this.state.category}, description - ${this.state.description}, amount - ${this.state.amount}`);

		this.spendingManager.addExpenditure(
			new Date(),
			this.state.category,
			this.state.amount,
			this.state.description);

		this.setState({
			description: "",
			amount: "",
			category: ""
		});
	}

	render()
	{
		return <form onSubmit={this.handleSubmit}>
			{
				this.groupedCategories.map((categoryGroup, index) =>
					<div className="category-group" key={index}>
						{
							categoryGroup.map(category =>
								<input
									className={"category-button" + (this.state.category == category ? " selected" : "")}
									key={category}
									name="category"
									value={category}
									type="button"
									onClick={this.handleChange}/>)
						}
					</div>)
			}
			<label>
				Amount:
				<input type="text" name="amount" value={this.state.amount} onChange={this.handleChange}/>
			</label>
			<label>
				Description:
				<input type="text" name="description" value={this.state.description} onChange={this.handleChange}/>
			</label>
			<input type="submit" value="Submit"/>
		</form>;
	}
}
