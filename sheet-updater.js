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
const range = "A1";
const apiKey = "AIzaSyBlVXClFKOd0SxDFMBmgZYcOZJdM0LUW0I";

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
	@observable status = status.unknown;

	trySync(expenditures, accessToken)
	{
		this.status = status.attemptingSync;

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

	_getJsonBody(expenditures)
	{
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

		return JSON.stringify(body);
	}
}
