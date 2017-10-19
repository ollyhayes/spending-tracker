export const statuses = {
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

		this.status = statuses.unknown;
	}

	registerUpdate(handler)
	{
		this.handlers.push(handler);
	}

	trySync(expenditures, accessToken)
	{
		this._setStatus(statuses.attemptingSync);

		return new Promise(resolve =>
		{
			setTimeout(
				() =>
				{
					if (window.pass)
					{
						resolve(true);
						this._setStatus(statuses.synced);
					}
					else
					{
						resolve(false);
						this._setStatus(statuses.noConnection);
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
