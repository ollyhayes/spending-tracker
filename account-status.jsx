import * as React from "react";

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
			userName: this.accountManager.userName
		};
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
		case this.accountManager.statuses.notConnected:
			return <span>Not connected to internet</span>;
		case this.accountManager.statuses.loading:
			return <span>Loading...</span>;
		case this.accountManager.statuses.signedOut:
			return <a onClick={this.handleSignIn}>Sign in</a>;
		case this.accountManager.statuses.signedIn:
			return <span>Signed in as: {this.state.userName}<a onClick={this.handleSignOut}>Sign out</a></span>;
		}
	}

	render()
	{
		return <div className="account-status">
			{ this._getStatus() }
		</div>;
	}
}
