import * as React from "react";
import * as ReactDOM from "react-dom";
import InputForm from "./input-form.jsx";
//import ExpenditureList from "./expenditure-list.jsx";
import SpendingManager from "./spending-manager.js";
import SheetUpdater from "./sheet-updater.js";

class Content extends React.Component
{
	constructor()
	{
		super();

		this.spendingManager = new SpendingManager();
		this.sheetUpdater = new SheetUpdater();

		this.spendingManager.registerUpdate(() =>
			this.sheetUpdater.trySync(this.spendingManager.expenditures));

		this.sheetUpdater.registerUpdate(status =>
		{
			if (status === this.sheetUpdater.statuses.synced)
				this.spendingManager.clearExpenditures();
		});
	}

	render()
	{
		// make this into a component that reflects the current state properly
		return <div>
			<div className="sync-status">
				4 items awaiting sync...
			</div>
			<InputForm spendingManager={this.spendingManager}/>
		</div>;

		// leaving this out for now
		// <ExpenditureList spendingManager={this.spendingManager}/>
	}
}

document.addEventListener("DOMContentLoaded", () =>
{
	ReactDOM.render(
		<Content/>,
		document.querySelector("body > div"));
});
