import * as React from "react";
import {observer} from "mobx-react";

@observer
export default class DebugMessages extends React.Component
{
	constructor(props)
	{
		super(props);

		this.logger = props.logger;
	}

	render()
	{
		return <pre className="debug-messages">
			{
				this.logger.messages.map((message, index) =>
					<div key={index}>{message}</div>
				)
			}
		</pre>;
	}
}
