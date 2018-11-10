import timestamp from "time-stamp";
import {observable} from "mobx";
import createEnum from "./enum.js";

export const status = createEnum(
	"unknown",
	"uploadingData",
	"processingSpreadsheet",
	"noConnection",
	"synced",
);

export const syncResult = createEnum(
	"success",
	"unauthorised",
	"failed"
);

function getSyncResult(statusCode)
{
	switch (statusCode)
	{
	case 200: return syncResult.success;
	case 401: return syncResult.unauthorised;
	default: return syncResult.failed;
	}
}

//const spreadsheetId = "1_WgnEfEjsM0EvyDkOq9U1iGbmcno4tGWZZUWyp8975w"; // test sheet
//const spreadsheetId = "19wRTaZ6ESmu4l2M7uV46OwDn5N3e-fzpgHSXdWChrOU"; // traveling sheet
const spreadsheetId = "1rsoB7YOOiwYLqo63TSO9X2P27Uis7olbnh6mRjz5x7c"; // example sheet for blog

//const sheetId = 1137143099; // traveling sheet spending sheet ID
const sheetId = 0; // blog sheet spending sheet ID
const apiKey = "AIzaSyBlVXClFKOd0SxDFMBmgZYcOZJdM0LUW0I";

const autoFillColumns = [
	{ startColumnIndex: 2, endColumnIndex: 3 }, // Location column (C)
	{ startColumnIndex: 6, endColumnIndex: 10 }, // Currency columns (G, H, I, J)
];

function getFirstAppendedRowIndexFrom(range)
{
	const regex = /.*![A-Z]+(\d+):[A-Z]+\d+/; // e.g. "Spending!A587:F588" matching 587 in group 1

	const rowNumber = Number(regex.exec(range)[1]);
	const rowIndex = rowNumber - 1;

	return rowIndex;
}

export default class SheetUpdater
{
	@observable status = status.unknown;

	constructor(logger)
	{
		this.logger = logger;
	}

	async trySync(expenditures, accessToken)
	{
		this.status = status.uploadingData;
		const {result, response} = await this._tryAppendItems(expenditures, accessToken);

		if (result === syncResult.success)
		{
			const firstAppendedRowIndex = getFirstAppendedRowIndexFrom(response.updates.updatedRange);

			const autofillRequests = autoFillColumns.map(indices =>
				this._getAutofillRequest(firstAppendedRowIndex, expenditures.length, indices));

			this.status = status.processingSpreadsheet;
			await this._tryBatchRequest(
				[
					...autofillRequests,
					this._getSortItemsRequest()
				],
				accessToken);
		}

		this.status = result === syncResult.success
			? status.synced
			: status.noConnection;

		return result;
	}

	_tryAppendItems(expenditures, accessToken)
	{
		const range = "A1";
		const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append`;
		const queryString = "responseValueRenderOption=FORMATTED_VALUE" +
			"&insertDataOption=INSERT_ROWS" + 
			"&valueInputOption=USER_ENTERED" + 
			"&responseDateTimeRenderOption=FORMATTED_STRING" + 
			"&includeValuesInResponse=false" + 
			"&alt=json" + 
			`&key=${apiKey}`;

		const url = `${baseUrl}?${queryString}`;
		const body = {
			values: expenditures.map(expenditure =>
				[
					timestamp("DD/MM/YYYY", expenditure.date),
					timestamp("HH:mm:ss", expenditure.date),
					"",
					expenditure.category,
					expenditure.description,
					expenditure.amount
				])
		};

		return this._tryMakeRequest(url, JSON.stringify(body), accessToken);
	}

	_getSortItemsRequest()
	{
		return {
			sortRange: {
				range: {
					sheetId,
					startRowIndex: 1,
					endRowIndex: null,
					startColumnIndex: 0,
					endColumnIndex: null
				},
				sortSpecs: [
					{
						dimensionIndex: 0, // Date column
						sortOrder: "ASCENDING"
					},
					{
						dimensionIndex: 1, // Time column
						sortOrder: "ASCENDING"
					}
				]
			}
		};
	}

	_getAutofillRequest(firstRowIndex, numberOfNewRows, { startColumnIndex, endColumnIndex })
	{
		return {
			autoFill: {
				sourceAndDestination: {
					source: {
						sheetId,
						startRowIndex: firstRowIndex - 1,
						endRowIndex: firstRowIndex,
						startColumnIndex,
						endColumnIndex
					},
					dimension: "ROWS",
					fillLength: numberOfNewRows
				}
			}
		};
	}

	_tryBatchRequest(requests, accessToken)
	{
		const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
		const body = {
			requests: requests,
			includeSpreadsheetInResponse: false
		};

		return this._tryMakeRequest(url, JSON.stringify(body), accessToken);
	}


	_tryMakeRequest(url, body, accessToken)
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
				if (request.readyState !== XMLHttpRequest.DONE)	// not finished yet
					return;

				const response = request.response === ""
					? null
					: JSON.parse(request.response);

				resolve({
					result: getSyncResult(request.status),
					response
				});
			};
		});
	}
}
