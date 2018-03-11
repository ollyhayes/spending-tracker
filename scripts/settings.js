import {observable, computed} from "mobx";

export default class Settings
{
	@observable
	_animate = null;
	@observable
	_blurEffect = null;
	@observable
	_autoSync = null;

	constructor()
	{
		const get = (name, defaultValue) =>
		{
			const fromStorage = localStorage.getItem(name);

			return fromStorage == undefined ? defaultValue : fromStorage;
		};

		this._animate = get("animate", true);
		this._blurEffect = get("blurEffect", false);
		this._autoSync = get("autoSync", true);
	}

	@computed
	get animate()
	{
		return this._animate;
	}

	set animate(value)
	{
		this._animate = value;
		localStorage.setItem("animate", value);
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
		localStorage.setItem("autoSync ", value);
	}
}
