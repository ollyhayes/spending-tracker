import * as React from "react";
import {observer} from "mobx-react";
import timestamp from "time-stamp";
import Icon from "./icon.jsx";

function isSameDay(x, y)
{
	return x.getDate() === y.getDate() && x.getMonth() === y.getMonth() && x.getFullYear() == y.getFullYear();
}

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
									<td>
										{
											isSameDay(new Date(), expenditure.date)
												? timestamp("HH:mm", expenditure.date)
												: timestamp("DD/MM/YY", expenditure.date)
										}
									</td>
									<td>{expenditure.description}</td>
									<td>{expenditure.amount}</td>
									<td>
										{
											expenditure.synced
												? <span className="good-message"><Icon iconName="check"/></span>
												: <span className="bad-message"><Icon iconName="times"/></span>
										}
									</td>
								</tr>).reverse()
							: <tr><td colSpan="5">No expenditures logged</td></tr>
					}
				</tbody>
			</table>
		</div>;
	}
}
