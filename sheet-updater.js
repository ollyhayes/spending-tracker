export const status = {
	unknown: 0,
	attemptingSync: 1,
	noConnection: 2,
	synced: 3
};

export default class SheetUpdater
{
	constructor()
	{
		this.handlers = [];

		this.status = status.unknown;
	}

	registerUpdate(handler)
	{
		this.handlers.push(handler);
	}

	trySync(expenditures, accessToken)
	{
		this._setStatus(status.attemptingSync);

		return new Promise(resolve =>
		{
			setTimeout(
				() =>
				{
					if (window.pass)
					{
						resolve(true);
						this._setStatus(status.synced);
					}
					else
					{
						resolve(false);
						this._setStatus(status.noConnection);
					}
				},
				2000);
		});
	}

	_setStatus(status)
	{
		this.status = status;

		this.handlers.forEach(handler => handler(status));
	}
}
