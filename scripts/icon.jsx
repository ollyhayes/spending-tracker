import * as React from "react";

export default function Icon(props)
{
	return <svg className={"icon" + (props.spinning ? " spinning" : "")}>
		<use xlinkHref={`fa-bundle.svg#${props.iconName}`}></use>
	</svg>;
}
