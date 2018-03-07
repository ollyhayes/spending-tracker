import * as React from "react";
import {observer} from "mobx-react";

@observer
export default class SpendingStatus extends React.Component
{
	constructor(props)
	{
		super(props);

		this.manager = props.manager;
	}

	_getStatus()
	{
		return ;
	}

	render()
	{
		return <div className="spending-status">
			{
				this.manager.numberOfItemsAwaitingSync === 0
					? <span className="good-message">Fully synced</span>
					: <span className="bad-message">{this.manager.numberOfItemsAwaitingSync} items awaiting sync</span>
			}
		</div>;
	}
}
