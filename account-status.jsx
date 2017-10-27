import * as React from "react";
import {observer} from "mobx-react";
import {status} from "./account-manager";

@observer
export default class AccountStatus extends React.Component
{
	constructor(props)
	{
		super(props);

		this.manager = props.manager;

		this.handleSignOut = this.handleSignOut.bind(this);
	}

	handleSignOut()
	{
		this.manager.accountManager.signOut();
	}

	render()
	{
		return this.manager.accountManager.status === status.signedIn
			? <div className="account-status">
				<span>Signed in as: {this.manager.accountManager.username}<a href="javascript:void(0)" onClick={this.handleSignOut}>Sign out</a></span>
			</div>
			: null;
	}
}
