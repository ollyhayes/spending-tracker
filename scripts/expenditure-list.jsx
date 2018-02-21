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
			<header>
				Recent expenditures:
			</header>
			<table>
				<thead>
					<tr>
						<th>Date</th>
						<th>Description</th>
						<th>Price</th>
						<th>Sync</th>
					</tr>
				</thead>
				<tbody>
					{
						this.manager.allExpenditures.length > 0
							? this.manager.allExpenditures.map(expenditure =>
								<tr key={expenditure.date.getTime()}>
									<td className="date">{timestamp("DD/MM/YY HH:mm:ss", expenditure.date)}</td>
									<td>{`${expenditure.category} - ${expenditure.description}`}</td>
									<td>{expenditure.amount}</td>
									<td>{expenditure.synced.toString()}</td>
								</tr>)
							: <tr><td colSpan="5">No expenditures logged</td></tr>
					}
				</tbody>
			</table>
		</div>;
	}
}
