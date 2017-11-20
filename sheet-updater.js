import moment from "moment";
import {observable} from "mobx";

export const status = {
	unknown: 0,
	attemptingSync: 1,
	noConnection: 2,
	synced: 3
};

//const spreadsheetId = "1_WgnEfEjsM0EvyDkOq9U1iGbmcno4tGWZZUWyp8975w"; // test sheet
const spreadsheetId = "19wRTaZ6ESmu4l2M7uV46OwDn5N3e-fzpgHSXdWChrOU";
const apiKey = "AIzaSyBlVXClFKOd0SxDFMBmgZYcOZJdM0LUW0I";

export default class SheetUpdater
{
	@observable status = status.unknown;

	trySync(expenditures, accessToken)
	{
		this.status = status.attemptingSync;

		const itemsAppended = this._appendItems(expenditures, accessToken);

		this.status = itemsAppended
			? status.synced
			: status.noConnection;

		return itemsAppended;
	}

	async _appendItems(expenditures, accessToken)
	{
		const range = "A1";
		const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append`;

		const queryString = "responseValueRenderOption=FORMATTED_VALUE" +
			"&insertDataOption=INSERT" + 
			"&valueInputOption=USER_ENTERED" + 
			"&responseDateTimeRenderOption=FORMATTED_STRING" + 
			"&includeValuesInResponse=false" + 
			"&alt=json" + 
			`&key=${apiKey}`;

		const url = `${baseUrl}?${queryString}`;
		const body = {
			values: expenditures.map(expenditure =>
			{
				const date = moment(expenditure.date);

				return [
					date.format("DD/MM/YYYY"),
					date.format("HH:mm:ss"),
					"",
					expenditure.category,
					expenditure.description,
					expenditure.amount
				];
			})
		};

		return await this._makeRequest(url, JSON.stringify(body), accessToken);
	}

	_makeRequest(url, body, accessToken)
	{
		return new Promise(resolve =>
		{
			const request = new XMLHttpRequest();
			request.open("POST", url, true);

			request.setRequestHeader("Content-type", "application/json");
			request.setRequestHeader("Authorization", `Bearer ${accessToken}`);

			request.send(body);

			request.onreadystatechange = () =>
			{
				if (request.readyState !== XMLHttpRequest.DONE)
					return;

				if (request.status === 200)
				{
					this.status = status.synced;
					resolve(true);
				}
				else
				{
					this.status = status.noConnection;
					resolve(false);
				}
			};
		});
	}
}
