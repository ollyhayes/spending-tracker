import timestamp from "time-stamp";
import {observable} from "mobx";

export default class Logger
{
	@observable messages = [];

	constructor()
	{
		this.realConsoleLog = console.log;
		console.log = message => this.log(message);

		window.onerror = (...args) =>
		{
			this.log("Global error handled - " + JSON.stringify(args));
		};
	}

	log(undatedMessage)
	{
		const message = `${timestamp("YY/MM/DD HH:mm:ss")} - ${undatedMessage}`;

		try
		{
			this.realConsoleLog(message);
		}
		catch (error)
		{
			this.realConsoleLog = () => {};
		}

		this.messages.push(message);
	}
}
