export default class SheetUpdater
{
	trySync(expenditures)
	{
		return new Promise((resolve, reject) =>
		{
			if (window.pass)
				resolve();
			else
				reject();
		});
	}
}
