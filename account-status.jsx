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

		this.handleSignIn = this.handleSignIn.bind(this);
		this.handleSignOut = this.handleSignOut.bind(this);
	}

	handleSignIn()
	{
		this.accountManager.signIn();
	}

	handleSignOut()
	{
		this.accountManager.signOut();
	}

	_getStatus()
	{
		switch (this.state.status)
		{
		case status.notConnected:
			return <span>Cannot connect to server</span>;
		case status.loading:
			return <span>Loading...</span>;
		case status.signedOut:
			return <a href="javascript:void(0)" onClick={this.handleSignIn}>Sign in</a>;
		case status.signedIn:
			return <span>Signed in as: {this.state.username}<a href="javascript:void(0)" onClick={this.handleSignOut}>Sign out</a></span>;
		}
	}

	render()
	{
		return <div className="account-status">
			{ this._getStatus() }
		</div>;
	}
}
