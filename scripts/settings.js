import {observable, computed} from "mobx";

export default class Settings
{
	@observable
	_blurEffect = null;
	@observable
	_autoSync = null;

	constructor()
	{
		const get = (name, defaultValue) =>
		{
			const storedOptionString = localStorage.getItem(name);

			return storedOptionString == undefined
				? defaultValue
				: storedOptionString === "true";
		};

		this._blurEffect = get("blurEffect", false);
		this._autoSync = get("autoSync", true);
	}

	@computed
	get blurEffect()
	{
		return this._blurEffect;
	}

	set blurEffect(value)
	{
		this._blurEffect = value;
		localStorage.setItem("blurEffect", value);
	}

	@computed
	get autoSync()
	{
		return this._autoSync;
	}

	set autoSync(value)
	{
		this._autoSync = value;
		localStorage.setItem("autoSync", value);
	}
}
