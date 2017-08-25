import * as React from "react";
import * as ReactDOM from "react-dom";
import InputForm from "./input-form.jsx";

class Content extends React.Component
{
	constructor()
	{
		super();
	}

	render()
	{
		return <InputForm/>;
	}
}

ReactDOM.render(
	<Content/>,
	document.querySelector("body > div"));
