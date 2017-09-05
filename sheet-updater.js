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

		return new Promise((resolve, reject) =>
		{
			if (window.pass)
			{
				resolve();
				this._setStatus(this.statuses.synced);
			}
			else
			{
				reject();
				this._setStatus(this.statuses.noConnection);
			}
		});
	}

	_setStatus(status)
	{
		this.status = status;

		this.handlers.forEach(handler => handler(status));
	}
}
