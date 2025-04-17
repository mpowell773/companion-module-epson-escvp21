const CHOICES_END = [
	{ id: '', label: 'None' },
	{ id: '\n', label: 'LF - \\n (Common UNIX/Mac)' },
	{ id: '\r\n', label: 'CRLF - \\r\\n (Common Windows)' },
	{ id: '\r', label: "CR - \\r (1970's RS232 terminal)" },
	{ id: '\x00', label: 'NULL - \\x00 (Can happen)' },
	{ id: '\n\r', label: 'LFCR - \\n\\r (Just stupid)' },
]

const PROJECTOR_COMMANDS = {
	'powerOn': 'PWR ON',
	'powerOff': 'PWR OFF',
	'shutterOpen': 'MUTE OFF',
	'shutterClose': 'MUTE ON',
}

export function getActionDefinitions(self) {
	return {
		send: {
			name: 'Send Command',
			options: [
				{
					type: 'textinput',
					id: 'id_send',
					label: 'Command:',
					tooltip: 'Do not use this action unless you need to implement an esc/vp21 command that has not yet been created.',
					default: '',
					useVariables: true,
				},
			],
			callback: async (action) => {
				const cmd = await self.parseVariablesInString(action.options.id_send)
				if (cmd != '') {
					sendCommand(self, cmd)
				}
			},
		},

		powerOn: {
			name: 'Power On',
			options: [
				{
					id: 'pwr_on_description',
					type: 'static-text',
					label: 'Info',
					value: 'Powers on the projector with the command: ' + PROJECTOR_COMMANDS.powerOn
				},
			],
			callback: async (action) => {
				sendCommand(self, PROJECTOR_COMMANDS.powerOn)
			},
		},

		powerOff: {
			name: 'Power Off',
			options: [
				{
					id: 'pwr_off_description',
					type: 'static-text',
					label: 'Info',
					value: 'Powers off the projector with the command: ' + PROJECTOR_COMMANDS.powerOff
				},
			],
			callback: async (action) => {
				sendCommand(self, PROJECTOR_COMMANDS.powerOff)
			},
		},

		shutterClose: {
			name: 'Close Shutter',
			options: [
				{
					id: 'close_shutter_description',
					type: 'static-text',
					label: 'Info',
					value: 'Closes shutter with the command: ' + PROJECTOR_COMMANDS.shutterClose
				},
			],
			callback: async (action) => {
				sendCommand(self, PROJECTOR_COMMANDS.shutterClose)
			},
		},

		shutterOpen: {
			name: 'Open Shutter',
			options: [
				{
					id: 'open_shutter_description',
					type: 'static-text',
					label: 'Info',
					value: 'Opens shutter with the command: ' + PROJECTOR_COMMANDS.shutterOpen
				},
			],
			callback: async (action) => {
				sendCommand(self, PROJECTOR_COMMANDS.shutterOpen)
			},
		},
	}
}

// Helper function for above actions
const sendCommand = (self, cmd) => {
	/*
	* create a binary buffer pre-encoded 'latin1' (8bit no change bytes)
	* sending a string assumes 'utf8' encoding
	* which then escapes character values over 0x7F
	* and destroys the 'binary' content
	*/
	const endLine = '\r'
	const sendBuf = Buffer.from(cmd + endLine, 'latin1')
	self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

	if (self.socket !== undefined && self.socket.isConnected) {
		self.socket.send(sendBuf)
		console.log(sendBuf.toString())
	} else {
		self.log('debug', 'Socket not connected :(')
	}
}	
