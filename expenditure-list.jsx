import * as React from "react";

export default class ExpenditureList extends React.Component
{
	constructor(props)
	{
		super(props);

		this.spendingManager = props.spendingManager;
		this.spendingManager.registerUpdate(() => this.handleUpdate());

		this.state = {
			expenditures: []
		};
	}

	handleUpdate()
	{
		this.setState({
			expenditures: this.spendingManager
		});
	}

	render()
	{
		return "";
		// begin here!
		// return <table>
		// 	<tbody>
		// 		{
		// 			this.state.expenditures.map(expenditure =>
		// 				<tr>

		// 				</tr>)
		// 		}
		// 	</tbody>
		// 	</table>;
	}
}
