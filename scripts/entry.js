import * as React from "react";
import * as ReactDOM from "react-dom";
import "./style.less";
import Manager from "./manager.js";
import Page from "./page.jsx";
import Logger from "./logger.js";
import Settings from "./settings.js";

const logger = new Logger();
const settings = new Settings();
const manager = new Manager(logger, settings);

document.addEventListener("DOMContentLoaded", () =>
{
	ReactDOM.render(
		React.createElement(
			Page,
			{manager, logger, settings}),
		document.querySelector("body > div"));
});
