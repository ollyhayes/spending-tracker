import * as React from "react";
import {status} from "./account-manager";

export default class AccountStatus extends React.Component
{
	constructor(props)
	{
		super(props);

		this.accountManager = props.accountManager;

		this.accountManager.registerUpdate(() =>
			this.setState({
				status: this.accountManager.status,
				username: this.accountManager.username
			}));

		this.state = {
			status: this.accountManager.status,
			username: this.accountManager.username
		};

		this.handleSignOut = this.handleSignOut.bind(this);
	}

	handleSignOut()
	{
		this.accountManager.signOut();
	}

	render()
	{
		return this.state.status == status.signedIn
			? <div className="account-status">
				<span>Signed in as: {this.state.username}<a href="javascript:void(0)" onClick={this.handleSignOut}>Sign out</a></span>
			</div>
			: null;
	}
}
