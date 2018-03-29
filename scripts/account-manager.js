import {observable} from "mobx";
import createEnum from "./enum.js";

function loadGapi()
{
	return new Promise((resolve, reject) =>
	{
		if (window.gapi)
			resolve(window.gapi);

		const script = document.createElement("script");
		script.type = "application/javascript";
		script.async = false;
		script.charset = "utf-8";
		script.src = "https://apis.google.com/js/api.js";
		script.addEventListener("load", () => resolve(window.gapi));
		script.addEventListener("error", error => reject(error));

		document.getElementsByTagName("head")[0].appendChild(script);

		// will leave this out for now, I think the infinite loading was because of initAuth (this is cached), not adding the script
		// setTimeout(
		// 	() => reject(new Error("Loading gapi failed after 10 seconds")),
		// 	10000);
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
				timeout: 10000,
				ontimeout: () => reject("Client library load error - timed out after 10 seconds")
			});
	});
}

function initAuth(gapi, options)
{
	return new Promise((resolve, reject) =>
	{
		const timeoutId = setTimeout(
			() => reject(new Error("Initialising auth failed after 5 seconds")),
			5000);

		// This doesn't return a promise, it's an object with a 'then' method that resolves to itself when initialised.
		// If we try to await it we get infinite recursion, so wrap it in a promise
		gapi.auth2.init(options)
			.then(
				() => 
				{
					clearTimeout(timeoutId);
					resolve(); // resolve to nothing instead of itself
				},
				error => 
				{
					clearTimeout(timeoutId);
					reject("Auth init error: " + JSON.stringify(error));
				});
	});
}

export const status = createEnum(
	"notConnected",
	"loading",
	"reauthorising",
	"signedOut",
	"signedIn"
);

export default class AccountManager
{
	@observable status = status.notConnected;
	@observable username = "";

	_initialised = false;
	_gapi = null;

	constructor(logger)
	{
		this.logger = logger;
	}

	async initialise()
	{
		this.status = status.loading;

		try
		{
			if (!this._gapi)
				this._gapi = await loadGapi();

			if (!this._gapi.auth2)
				await loadAuth2(this._gapi);

			if (!this._initialised)
				await initAuth(
					this._gapi,
					{
						clientId: "899237718363-7s1kvbo7bj1kimho5njef9psdj8r8l3p.apps.googleusercontent.com",
						scope: "https://www.googleapis.com/auth/spreadsheets"
					});

			// annoyingly the GoogleAuth object doesn't know if it's not been initialised so we have to remember
			this._initialised = true;
		}
		catch (error)
		{
			this.logger.log("Error initialising auth: " + error.message);
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
			this.logger.log("Attempting sign in");
			await this._auth.signIn();
			this.logger.log("Signin requested");
		}
		catch (error)
		{
			this.logger.log("Signin failed - " + JSON.stringify(error));
			throw error;
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
			this.logger.log("Attempting sign out");
			await this._auth.disconnect();
			this.logger.log("Signout succeded");
		}
		catch (error)
		{
			this.logger.log("Signout failed - " + JSON.stringify(error));
			throw error;
		}
		finally
		{
			this._updateStatus();
		}
	}

	async reloadAccessToken()
	{
		this.status = status.reauthorising;

		try
		{
			await this._user.reloadAuthResponse();
		}
		catch (error)
		{
			this.logger.log("Reauthorising failed - " + JSON.stringify(error));
			throw error;
		}
		finally
		{
			this._updateStatus();
		}
	}

	getAccessToken()
	{
		return this._user.getAuthResponse().access_token;
	}

	_updateStatus()
	{
		if (!this._initialised)
		{
			this.status = status.notConnected;
			this.username = "";
		}
		else if (!this._auth.isSignedIn.get())
		{
			this.status = status.signedOut;
			this.username = "";
		}
		else
		{
			this.status = status.signedIn;
			this.username = this._user.getBasicProfile().getName();
		}
	}

	get _auth()
	{
		return this._gapi.auth2.getAuthInstance();
	}

	get _user()
	{
		return this._auth.currentUser.get();
	}
}
