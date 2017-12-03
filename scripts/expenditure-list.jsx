import * as React from "react";

export default class ExpenditureList extends React.Component
{
	constructor(props)
	{
		super(props);

		this.spendingManager = props.spendingManager;
		this.spendingManager.registerUpdate(() => this.handleUpdate());

		this.state = {
			expenditures: this.spendingManager.expenditures
		};
	}

	handleUpdate()
	{
		this.setState({
			expenditures: this.spendingManager.expenditures
		});
	}

	render()
	{
		return <div className="expenditure-list">
			<table>
				<thead>
					<tr>
						<th>Date</th>
						<th>Category</th>
						<th>Description</th>
						<th>Amount</th>
					</tr>
				</thead>
				<tbody>
					{
						this.state.expenditures.map(expenditure =>
							<tr key={expenditure.date.getTime()}>
								<td>{expenditure.date.toString()}</td>
								<td>{expenditure.category}</td>
								<td>{expenditure.description}</td>
								<td>{expenditure.amount}</td>
							</tr>)
					}
				</tbody>
			</table>
		</div>;
	}
}
