import * as React from "react";

export default class InputForm extends React.Component
{
	constructor()
	{
		super();

		this.state = {
			description: "",
			amount: ""
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event)
	{
		this.setState({[event.target.name]: event.target.value});
	}

	handleSubmit(event)
	{
		console.log(`Submitting: description - ${this.state.description}, amount - ${this.state.amount}`);
		event.preventDefault();
	}

	render()
	{
		return <form>
			<input type="text" name="description" value={this.state.description} onChange={this.handleChange}/>
			<input type="text" name="amount" value={this.state.amount} onChange={this.handleChange}/>
			<input type="submit" value="Submit"/>
		</form>;
	}
}
