import * as React from "react";
import {observer} from "mobx-react";
import timestamp from "time-stamp";

@observer
export default class ExpenditureList extends React.Component
{
	constructor(props)
	{
		super(props);

		this.manager = props.manager;
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
						<th>Synced</th>
					</tr>
				</thead>
				<tbody>
					{
						this.manager.allExpenditures.map(expenditure =>
							<tr key={expenditure.date.getTime()}>
								<td>{timestamp("DD/MM/YY HH:mm:ss", expenditure.date)}</td>
								<td>{expenditure.category}</td>
								<td>{expenditure.description}</td>
								<td>{expenditure.amount}</td>
								<td>{expenditure.synced.toString()}</td>
							</tr>)
					}
				</tbody>
			</table>
		</div>;
	}
}
