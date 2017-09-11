export default class AccountManager
{
	constructor()
	{
		this.handlers = [];

		this.initialised = false;
		this.currentUser = "";
		this.accessToken = "";
	}

	registerUpdate(handler)
	{
		this.handlers.push(handler);
	}

	initialise()
	{
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
		await gapi.auth2.getAuthInstance().signIn();

		this._update();
	}

	async signOut()
	{
		await gapi.auth2.getAuthInstance().signOut();

		this._update();
	}

	_update()
	{
		const auth = gapi.auth2.getAuthInstance();

		if (auth.isSignedIn.get())
		{
			const user = auth.currentUser.get();
			this.currentUser = user.getBasicProfile().getName();
			this.accessToken = user.getAuthResponse().access_token;
		}
		else
		{
			this.currentUser = "";
			this.accessToken = "";
		}

		this.handlers.forEach(handler => handler());
	}
}
