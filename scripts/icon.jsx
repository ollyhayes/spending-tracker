import * as React from "react";

export default function Icon(props)
{
	return <svg className="icon">
		<use xlinkHref={`svg-sprites/fa-solid.svg#${props.iconName}`}></use>
	</svg>;
}
