import {observable} from "mobx";

function loadGapi()
{
	return new Promise((resolve, reject) =>
	{
		const script = document.createElement("script");
		script.type = "application/javascript";
		script.async = false;
		script.charset = "utf-8";
		script.src = "https://apis.google.com/js/api.js";
		script.addEventListener("load", () => resolve(window.gapi));
		script.addEventListener("error", error => reject(error));

		document.getElementsByTagName("head")[0].appendChild(script);
	});
}

function loadAuth2(gapi)
{
	return new Promise((resolve, reject) =>
	{
		gapi.load(
			"auth2",
			{
				callback: resolve,
				onerror: error => reject("Client library load error: ", JSON.stringify(error)),
				timeout: 30000,
				ontimeout: () => reject("Client library load error - timed out after 5 seconds")
			});
	});
}

function initAuth(gapi, options)
{
	return new Promise((resolve, reject) =>
		// I don't think this returns a real promise so we have to wrap it
		gapi.auth2.init(options)
			.then(
				() => resolve(), // if we pass the resolve method directly the page locks up
				error => reject("Auth init error: " + JSON.stringify(error))));
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

	user = null;
	gapi = null;

	async initialise()
	{
		this.status = status.loading;

		try
		{
			if (!this.gapi)
				this.gapi = await loadGapi();

			if (!this.gapi.auth2)
				await loadAuth2(this.gapi);

			await initAuth(
				this.gapi,
				{
					clientId: "899237718363-7s1kvbo7bj1kimho5njef9psdj8r8l3p.apps.googleusercontent.com",
					scope: "https://www.googleapis.com/auth/spreadsheets"
				});
		}
		catch (error)
		{
			console.log("Error initialising auth: ", error);
		}
		finally
		{
			this._updateStatus();
		}
	}

	async signIn()
	{
		this.status = status.loading;

		try
		{
			await this.gapi.auth2.getAuthInstance().signIn();
		}
		catch (error)
		{
			alert("Sign in error: " + JSON.stringify(error));
		}
		finally
		{
			this._updateStatus();
		}
	}

	async signOut()
	{
		this.status = status.loading;

		try
		{
			await this.gapi.auth2.getAuthInstance().signOut();
		}
		finally
		{
			this._updateStatus();
		}
	}

	getAccessToken()
	{
		return this.user.getAuthResponse().access_token;
	}

	_updateStatus()
	{
		if (!this.gapi || !this.gapi.auth2)
		{
			this.status = status.notConnected;
			this.username = "";
			this.user = null;
		}
		else if (!this.gapi.auth2.getAuthInstance().isSignedIn.get())
		{
			this.status = status.signedOut;
			this.username = "";
			this.user = null;
		}
		else
		{
			this.status = status.signedIn;
			this.user = this.gapi.auth2.getAuthInstance().currentUser.get();
			this.username = this.user.getBasicProfile().getName();
		}
	}
}
