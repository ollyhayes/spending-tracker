export default class SheetUpdater
{
	constructor()
	{
		this.handlers = [];

		this.statuses = {
			unknown: 0,
			attemptingSync: 1,
			noConnection: 2,
			synced: 3
		};

		this.status = this.statuses.idle;
	}

	registerUpdate(handler)
	{
		this.handlers.push(handler);
	}

	trySync(expenditures)
	{
		this._setStatus(this.statuses.attemptingSync);

		return new Promise(resolve =>
		{
			setTimeout(
				() =>
				{
					if (window.pass)
					{
						resolve(true);
						this._setStatus(this.statuses.synced);
					}
					else
					{
						resolve(false);
						this._setStatus(this.statuses.noConnection);
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
