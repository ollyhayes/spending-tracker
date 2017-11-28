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

		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleAmountElementKeyDown = this.handleAmountElementKeyDown.bind(this);

		this.amountElement = null;
		this.descriptionElement = null;
	}

	handleCategoryChange(event)
	{
		this.handleChange(event);

		this.amountElement.focus();
	}

	handleChange(event)
	{
		this.setState({[event.target.name]: event.target.value});
	}

	handleSubmit(event)
	{
		event.preventDefault();

		if (this.state.category === "")
		{
			alert("Select a category");
			return false;
		}

		if (this.state.amount === "")
		{
			alert("Enter an amount");
			return false;
		}

		this.manager.addExpenditure(
			new Date(),
			this.state.category,
			this.state.amount,
			this.state.description);

		this.setState({
			description: "",
			amount: "",
			category: ""
		});

		document.activeElement.blur();
		document.documentElement.scrollTop = document.body.scrollTop = 0; // scroll back to top for new input
	}

	handleAmountElementKeyDown(event)
	{
		if (event.keyCode === 13) // enter button
		{
			event.preventDefault();
			this.descriptionElement.focus();
		}
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
						type="number"
						step="0.01"
						name="amount"
						value={this.state.amount}
						onChange={this.handleChange}
						ref={element => this.amountElement = element}
						onKeyDown={this.handleAmountElementKeyDown}/>
				</div>
				<div className="text-section">
					<label>Enter description:</label>
					<input
						type="text"
						name="description"
						value={this.state.description}
						onChange={this.handleChange}
						ref={element => this.descriptionElement = element}/>
				</div>
				<div className="submit-section">
					<input type="submit" value="Submit"/>
				</div>
			</form>
		</div>;
	}
}
