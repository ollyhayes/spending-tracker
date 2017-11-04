import {observable} from "mobx";

const gapi = window.gapi;

function loadGapi()
{
	return new Promise((resolve, reject) =>
	{
		gapi.load(
			"auth2",
			{
				callback: resolve,
				onerror: error => reject("Client library load error: ", error),
				timeout: 30000,
				ontimeout: () => reject("Client library load error - timed out after 5 seconds")
			});
	});
}

function initAuth(options)
{
	return new Promise((resolve, reject) =>
		// I don't think this returns a real promise so we have to wrap it
		gapi.auth2.init(options)
			.then(
				() => resolve(), // if we pass the resolve method directly the page locks up
				error => reject("Auth init error: " + error)));
}

export const status = {
	notConnected: 0,
	loading: 1,
	signedOut: 2,
	signedIn: 3
};

export default class AccountManager
{
	@observable status = status.notConnected;
	@observable username = "";
	@observable accessToken = "";

	async initialise()
	{
		this.status = status.loading;

		try
		{
			await loadGapi();

			await initAuth({
				clientId: "899237718363-7s1kvbo7bj1kimho5njef9psdj8r8l3p.apps.googleusercontent.com",
				scope: "https://www.googleapis.com/auth/spreadsheets"
			});
		}
		catch (error)
		{
			console.log(error);
		}
		finally
		{
			this._updateStatus();
		}
	}

	async signIn()
	{
		this.status = status.loading;

		await gapi.auth2.getAuthInstance().signIn();

		this._updateStatus();
	}

	async signOut()
	{
		this.status = status.loading;

		await gapi.auth2.getAuthInstance().signOut();

		this._updateStatus();
	}

	_updateStatus()
	{
		if (!gapi || !gapi.auth2)
		{
			this.status = status.notConnected;
			this.username = "";
			this.accessToken = "";
		}
		else if (!gapi.auth2.getAuthInstance().isSignedIn.get())
		{
			this.status = status.signedOut;
			this.username = "";
			this.accessToken = "";
		}
		else
		{
			this.status = status.signedIn;
			const user = gapi.auth2.getAuthInstance().currentUser.get();
			this.username = user.getBasicProfile().getName();
			this.accessToken = user.getAuthResponse().access_token;
		}
	}
}
