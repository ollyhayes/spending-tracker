import * as React from "react";

export default class DebugMessages extends React.Component
{
	constructor(props)
	{
		super(props);
	}

	render()
	{
		return <div>
			<pre>
				some log messages
				some log messages
				some log messages
			</pre>
		</div>;
	}
}
