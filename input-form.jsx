import * as React from "react";

export default class InputForm extends React.Component
{
	constructor()
	{
		super();

		this.state = {
			description: "",
			amount: "",
			category: ""
		};

		this.groupedCategories = [
			[
				"Food - Breakfast",
				"Food - Lunch",
				"Food - Dinner"
			],
			[
				"Drinks - Soft",
				"Drinks - Alcoholic"
			],
			[
				"Travel",
				"Medical"
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
		console.log(`Submitting: category - ${this.state.category}, description - ${this.state.description}, amount - ${this.state.amount}`);
		event.preventDefault();
	}

	render()
	{
		return <form onSubmit={this.handleSubmit}>
			<div>
				{
					this.groupedCategories.forEach(categoryGroup =>
						<div>
							{
								categoryGroup.forEach(category =>
									<input name="category" value={category} type="button" onClick={this.handleChange}/>)
							}
						</div>)
				}
			</div>
			<div>
				<input type="text" name="amount" value={this.state.amount} onChange={this.handleChange}/>
				<input type="text" name="description" value={this.state.description} onChange={this.handleChange}/>
				<input type="submit" value="Submit"/>
			</div>
		</form>;
	}
}
