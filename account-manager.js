const gapi = window.gapi;

export default class AccountManager
{
	constructor()
	{
		this.handlers = [];

		this.statuses = {
			notConnected: 0,
			loading: 1,
			signedOut: 2,
			signedIn: 3
		};

		this.status = this.statuses.notConnected;
		this.userName = "";
		this.accessToken = "";
	}

	registerUpdate(handler)
	{
		this.handlers.push(handler);
	}

	initialise()
	{
		this._setLoading();

		return new Promise((resolve, reject) =>
		{
			gapi.load(
				"auth2",
				{
					callback: async () =>
					{
						try
						{
							await gapi.auth2.init({
								clientId: "899237718363-7s1kvbo7bj1kimho5njef9psdj8r8l3p.apps.googleusercontent.com",
								scope: "https://www.googleapis.com/auth/spreadsheets"
							});

							const auth = gapi.auth2.getAuthInstance();
							auth.isSignedIn.listen(() => this._update());

							this.initialised = true;
							this._update();
							resolve();
						}
						catch (error)
						{
							reject(`Auth init error: ${error}`);
						}
					},
					onerror: () => reject("Client library load error"),
					timeout: 5000,
					ontimeout: () => reject("Client library load error")
				});
		});
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
		this.status = this.statuses.loading;
		this.handlers.forEach(handler => handler());
	}

	_update()
	{
		if (!gapi.auth2)
		{
			this.status = this.statuses.notConnected;
			this.username = "";
			this.accessToken = "";
		}
		else if (!gapi.auth2.getAuthInstance().isSignedIn.get())
		{
			this.status = this.statuses.signedOut;
			this.username = "";
			this.accessToken = "";
		}
		else
		{
			this.status = this.statuses.signedIn;
			const user = gapi.auth2.getAuthInstance().currentUser.get();
			this.username = user.getBasicProfile().getName();
			this.accessToken = user.getAuthResponse().access_token;
		}

		this.handlers.forEach(handler => handler());
	}
}
