import * as React from "react";

export default class InputForm extends React.Component
{
	constructor(props)
	{
		super(props);

		this.manager = props.manager;

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
				"Laundry",
				"Clothing",
				"Toiletries",
				"Medical"
			],
			[
				"Sights",
				"Transport",
				"Technology",
				"Other"
			],
		];

		this.focusOnCategoryChangeElement = null;

		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleCategoryChange(event)
	{
		this.handleChange(event);

		this.focusOnCategoryChangeElement.focus();
	}

	handleChange(event)
	{
		this.setState({[event.target.name]: event.target.value});
	}

	handleSubmit(event)
	{
		event.preventDefault();
		console.log(`Submitting: category - ${this.state.category}, description - ${this.state.description}, amount - ${this.state.amount}`);

		this.manager.spendingManager.addExpenditure(
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
		return <div className="input-form">
			<header>New item...</header>
			<form onSubmit={this.handleSubmit}>
				<div className="category-section">
					<label>Select category:</label>
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
											onClick={this.handleCategoryChange}/>)
								}
							</div>)
					}
				</div>
				<div className="text-section">
					<label>Enter amount:</label>
					<input
						type="text"
						name="amount"
						value={this.state.amount}
						onChange={this.handleChange}
						ref={element => this.focusOnCategoryChangeElement = element}/>
				</div>
				<div className="text-section">
					<label>Enter description:</label>
					<input type="text" name="description" value={this.state.description} onChange={this.handleChange}/>
				</div>
				<div className="submit-section">
					<input type="submit" value="Submit"/>
				</div>
			</form>
		</div>;
	}
}
