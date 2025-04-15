import { Regex } from '@companion-module/base'

const REGEX_IP_OR_HOST =
	'/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})$|^((([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9]))$/'

export const ConfigFields = [
	{
		type: 'textinput',
		id: 'host',
		label: 'Projector IP Address',
		width: 8,
		regex: REGEX_IP_OR_HOST,
	},
	{
		type: 'textinput',
		id: 'port',
		label: 'Target Port',
		width: 4,
		default: 3629,
		regex: Regex.PORT,
	},
	{
		type: 'checkbox',
		id: 'saveresponse',
		label: 'Save TCP Response',
		default: false,
	},
	{
		type: 'dropdown',
		id: 'convertresponse',
		label: 'Convert TCP Response Format',
		default: 'none',
		choices: [
			{ id: 'none', label: 'No conversion' },
			{ id: 'hex', label: 'To Hex' },
			{ id: 'string', label: 'To String' },
		],
		isVisible: (configValues) => !!configValues.saveresponse,
	},
]
