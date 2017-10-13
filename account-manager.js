const gapi = window.gapi;

function loadGapi()
{
	return new Promise((resolve, reject) =>
	{
		gapi.load(
			"auth2",
			{
				callback: resolve,
				onerror: () => reject("Client library load error"),
				timeout: 5000,
				ontimeout: () => reject("Client library load error")
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

export const statuses = {
	notConnected: 0,
	loading: 1,
	signedOut: 2,
	signedIn: 3
};

export default class AccountManager
{
	constructor()
	{
		this.handlers = [];

		this.status = statuses.notConnected;
		this.userName = "";
		this.accessToken = "";
	}

	registerUpdate(handler)
	{
		this.handlers.push(handler);
	}

	async initialise()
	{
		this._setLoading();

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
			this._update();
		}
	}

	async signIn()
	{
		this._setLoading();

		await gapi.auth2.getAuthInstance().signIn();

		this._update();
	}

	async signOut()
	{
		this._setLoading();

		await gapi.auth2.getAuthInstance().signOut();

		this._update();
	}

	_setLoading()
	{
		this.status = statuses.loading;
		this.handlers.forEach(handler => handler());
	}

	_update()
	{
		if (!gapi || !gapi.auth2)
		{
			this.status = statuses.notConnected;
			this.username = "";
			this.accessToken = "";
		}
		else if (!gapi.auth2.getAuthInstance().isSignedIn.get())
		{
			this.status = statuses.signedOut;
			this.username = "";
			this.accessToken = "";
		}
		else
		{
			this.status = statuses.signedIn;
			const user = gapi.auth2.getAuthInstance().currentUser.get();
			this.username = user.getBasicProfile().getName();
			this.accessToken = user.getAuthResponse().access_token;
		}

		this.handlers.forEach(handler => handler());
	}
}
