import * as React from "react";

export default class SyncStatus extends React.Component
{
	constructor(props)
	{
		super(props);

		this.spendingManager = props.spendingManager;
		this.sheetUpdater = props.sheetUpdater;

		this.spendingManager.registerUpdate(() =>
			this.setState({numberOfItemsAwaitingSync: this.spendingManager.expenditures.length}));

		this.sheetUpdater.registerUpdate(status =>
			this.setState({syncInProgress: status === this.sheetUpdater.statuses.attemptingSync}));

		this.state = {
			syncInProgress: this.sheetUpdater.status === this.sheetUpdater.statuses.attemptingSync,
			numberOfItemsAwaitingSync: this.spendingManager.expenditures.length
		};
	}

	render()
	{
		return <div className="sync-status">
			{
				this.state.syncInProgress
					? <span>Attempting sync</span>
					: <span>{this.state.numberOfItemsAwaitingSync} items awaiting sync...</span>
			}
		</div>;
	}
}
