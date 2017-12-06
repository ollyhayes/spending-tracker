import * as React from "react";
import * as ReactDOM from "react-dom";
import "./style.less";
import Manager from "./manager.js";
import Page from "./page.jsx";
import Logger from "./logger.js";

const logger = new Logger();
const manager = new Manager(logger);

document.addEventListener("DOMContentLoaded", () =>
{
	ReactDOM.render(
		React.createElement(
			Page,
			{manager}),
		document.querySelector("body > div"));
});
