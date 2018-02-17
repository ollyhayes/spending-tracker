import {observable} from "mobx";
import createEnum from "./enum.js";

export const page = createEnum(
	"main",
	"settings",
	"debugMessages"
);

export default class PageState
{
	@observable
	_currentPage = null;

	constructor()
	{
		window.onpopstate = stateEvent => this._currentPage = stateEvent.state;

		const pageFromHash = window.location.hash.replace("#", "");

		this._currentPage = page[pageFromHash] || page.main;
	}

	setPage(newPage)
	{
		this._currentPage = newPage;

		const newUrl = newPage === page.main
			? "#"
			: "#" + newPage;

		window.history.pushState(newPage, "", newUrl);
	}

	get settingsShown()
	{
		return this._currentPage === page.settings;
	}

	get debugMessagesShown()
	{
		return this._currentPage === page.debugMessages;
	}
}
