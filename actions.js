const CHOICES_END = [
	{ id: '', label: 'None' },
	{ id: '\n', label: 'LF - \\n (Common UNIX/Mac)' },
	{ id: '\r\n', label: 'CRLF - \\r\\n (Common Windows)' },
	{ id: '\r', label: "CR - \\r (1970's RS232 terminal)" },
	{ id: '\x00', label: 'NULL - \\x00 (Can happen)' },
	{ id: '\n\r', label: 'LFCR - \\n\\r (Just stupid)' },
]

export function getActionDefinitions(self) {
	return {
		send: {
			name: 'Send Command',
			options: [
				{
					type: 'textinput',
					id: 'id_send',
					label: 'Command:',
					tooltip: 'Do not use this action unless you need to implement an esc/vp21 command that has not yet been created. ',
					default: '',
					useVariables: true,
				},
				{
					type: 'dropdown',
					id: 'id_end',
					label: 'Command End Character:',
					default: '\r',
					choices: CHOICES_END,
				},
			],
			callback: async (action) => {
				// This is wet code that is left behind for an essentially deprecated action
				const cmd = unescape(await self.parseVariablesInString(action.options.id_send))

				if (cmd != '') {
					/*
					 * create a binary buffer pre-encoded 'latin1' (8bit no change bytes)
					 * sending a string assumes 'utf8' encoding
					 * which then escapes character values over 0x7F
					 * and destroys the 'binary' content
					 */
					const sendBuf = Buffer.from(cmd + action.options.id_end, 'latin1')
					self.log('debug', 'sending to ' + self.config.host + ': ' + sendBuf.toString())

					if (self.socket !== undefined && self.socket.isConnected) {
						self.socket.send(sendBuf)
						console.log(sendBuf.toString())
					} else {
						self.log('debug', 'Socket not connected :(')
					}
				}
			},
		},
		powerOn: {
			name: 'Power On',
			callback: async (action) => {
				const cmd = 'PWR ON'
				sendCommand(self, cmd)
			},
		},
	}
}

// Helper function for above actions
const sendCommand = (self, cmd) => {
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
