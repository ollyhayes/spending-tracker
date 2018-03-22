import * as React from "react";
import {observer} from "mobx-react";
import {accountStatus} from "./manager";

@observer
export default class AccountStatus extends React.Component
{
	constructor(props)
	{
		super(props);

		this.manager = props.manager;

		this.handleSignIn = this.handleSignIn.bind(this);
		this.handleSignOut = this.handleSignOut.bind(this);
	}

	handleSignIn()
	{
		this.manager.signIn();
	}

	handleSignOut()
	{
		this.manager.signOut();
	}

	render()
	{
		return <div className="account-status">
			{ this._getStatus() }
		</div>;
	}

	_getStatus()
	{
		switch (this.manager.accountStatus)
		{
		case accountStatus.signedIn:
			return <span className="good-message">
				{this.manager.accountUsername}<a href="javascript:void(0)" onClick={this.handleSignOut}>Sign out</a>
			</span>;
		case accountStatus.signedOut:
			return <span className="neutral-message">
				Signed out<a href="javascript:void(0)" onClick={this.handleSignIn}>Sign in</a>
			</span>;
		case accountStatus.loading:
			return <span className="neutral-message">
				Loading...
			</span>;
		case accountStatus.notConnected:
			return <span className="bad-message">
				Not connected
			</span>;
		}
	}
}
