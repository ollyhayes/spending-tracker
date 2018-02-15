export default function createEnum(...options)
{
	const enumObject = {};

	options.forEach(option =>
		enumObject[option] = option);

	return enumObject;
}
