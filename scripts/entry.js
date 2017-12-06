import * as React from "react";
import * as ReactDOM from "react-dom";
import "./style.less";
import Manager from "./manager.js";
import Page from "./page.jsx";

const manager = new Manager();

document.addEventListener("DOMContentLoaded", () =>
{
	ReactDOM.render(
		React.createElement(
			Page,
			{manager}),
		document.querySelector("body > div"));
});
