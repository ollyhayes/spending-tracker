import * as React from "react";

const appCache = window.applicationCache;

export default class AppCacheStatus extends React.Component
{
	constructor()
	{
		super();

		const events = [
			"cached",
			"checking",
			"downloading",
			"error",
			"noupdate",
			"obsolete",
			"progress",
			"updateready"
		];

		events.forEach(event => appCache.addEventListener(event, () =>
			this.setState({cacheStatus: appCache.status})));

		this.state = {
			cacheStatus: appCache.status
		};
	}

	_getStatus()
	{
		switch (appCache.status)
		{
		case appCache.UNCACHED: // UNCACHED == 0
			return <span className="bad-message">Application uncached</span>;
		case appCache.IDLE: // IDLE == 1
			return null;
		case appCache.CHECKING: // CHECKING == 2
			return <span className="neutral-message">Checking for updates...</span>;
		case appCache.DOWNLOADING: // DOWNLOADING == 3
			return <span className="neutral-message">Downloading updates...</span>;
		case appCache.UPDATEREADY:  // UPDATEREADY == 4
			return <span className="good-message">Update ready</span>;
		case appCache.OBSOLETE: // OBSOLETE == 5
			return <span className="bad-message">Update required</span>;
		default:
			return <span className="bad-message">Error</span>;
		}
	}

	render()
	{
		return <div className="app-cache-status">
			{ this._getStatus() }
		</div>;
	}
}
