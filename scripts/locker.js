export default class Locker
{
	constructor(resync)
	{
		this._syncQueud = false;
		this._syncInProgress = false;
		this._resync = resync;
	}

	async lock(func, log)
	{
		if (this._syncInProgress)
		{
			log("Sync in progress - queueing");
			this._syncQueued = true;
			return;
		}

		this._syncInProgress = true;

		try
		{
			await func();
		}
		finally
		{
			this._syncInProgress = false;
		}

		if (this._syncQueued)
		{
			this._syncQueued = false;
			await this._resync();
		}
	}
}
