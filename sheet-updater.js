export const status = {
	unknown: 0,
	attemptingSync: 1,
	noConnection: 2,
	synced: 3
};

const spreadsheetId = "1_WgnEfEjsM0EvyDkOq9U1iGbmcno4tGWZZUWyp8975w";
const range = "A1";
const apiKey = "AIzaSyBlVXClFKOd0SxDFMBmgZYcOZJdM0LUW0I"

const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append`;

const queryString = "responseValueRenderOption=FORMATTED_VALUE" +
	"&insertDataOption=OVERWRITE" + 
	"&valueInputOption=USER_ENTERED" + 
	"&responseDateTimeRenderOption=FORMATTED_STRING" + 
	"&includeValuesInResponse=false" + 
	"&alt=json" + 
	`&key=${apiKey}`;

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
			const request = new XMLHttpRequest();
			request.open("POST", `${url}?${queryString}`, true);

			request.setRequestHeader("Content-type", "application/json");
			request.setRequestHeader("Authorization", `Bearer ${accessToken}`);

			request.send(this._getJsonBody(expenditures));

			request.onreadystatechange = () =>
			{
				if (request.readyState !== XMLHttpRequest.DONE)
					return;

				if (request.status === 200)
				{
					this._setStatus(status.synced);
					resolve(true);
				}
				else
				{
					this._setStatus(status.noConnection);
					resolve(false);
				}
			};
		});
	}

	_getJsonBody(expenditures)
	{
		const body = {
			values: expenditures.map(expenditure => [
				expenditure.date.toString(), // use moment here to format as dd/MM/yy
				"12:00:00",
				"Kuala Lumpur",
				expenditure.category,
				expenditure.description,
				expenditure.amount
			])
		};

		return JSON.stringify(body);
	}

	_setStatus(status)
	{
		this.status = status;

		this.handlers.forEach(handler => handler(status));
	}
}
