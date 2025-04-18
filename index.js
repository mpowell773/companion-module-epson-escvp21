import { InstanceBase, InstanceStatus, runEntrypoint, TCPHelper } from '@companion-module/base'
import { ConfigFields } from './config.js'
import { getActionDefinitions } from './actions.js'
import { getFeedbackDefinitions } from './feedbacks.js'

class EpsonEscvp21Instance extends InstanceBase {
	async init(config) {
		this.config = config

		this.setActionDefinitions(getActionDefinitions(this))
		this.setFeedbackDefinitions(getFeedbackDefinitions(this))

		await this.configUpdated(config)
	}

	async configUpdated(config) {
		// TCP Connection correlates to socket
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.config = config
		this.init_tcp()
		this.init_tcp_variables()
		this.init_escvp21_connection()
	}

	async destroy() {
		if (this.socket) {
			this.socket.destroy()
		} else {
			this.updateStatus(InstanceStatus.Disconnected)
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return ConfigFields
	}

	init_tcp() {
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.host) {
			this.socket = new TCPHelper(this.config.host, this.config.port)

			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})

			this.socket.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', 'Network error: ' + err.message)
			})

			this.socket.on('data', (data) => {
				if (this.config.saveresponse) {
					let dataResponse = data

					if (this.config.convertresponse == 'string') {
						dataResponse = data.toString()
					} else if (this.config.convertresponse == 'hex') {
						dataResponse = data.toString('hex')
					}

					console.log(dataResponse)
					this.setVariableValues({ tcp_response: dataResponse })
				}
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	init_tcp_variables() {
		this.setVariableDefinitions([{ name: 'Last TCP Response', variableId: 'tcp_response' }])
		this.setVariableValues({ tcp_response: '' })
	}

	async init_escvp21_connection() {
		await this.waitForSocketConnection()

		// The hex sequence below is the escp/vp.net handshake
		const sendBuf = Buffer.from('4553432F56502E6E6574100300000000' + '\r', 'hex')
		if (this.socket !== undefined && this.socket.isConnected) {
			this.socket.send(sendBuf)
		} else {
			this.log('debug', 'Socket not connected :(')
		}
	}

	// function that waits until socket is connected
	// Thank you https://github.com/bitfocus/companion-module-extron-mmx-tcp/blob/main/index.js
	waitForSocketConnection() {
		return new Promise((resolve, reject) => {
			const checkConnection = () => {
				if (this.socket !== undefined && this.socket.isConnected) {
					resolve();
				} else {
					setTimeout(checkConnection, 500)
				}
			};

			checkConnection()
		})
	}
}

runEntrypoint(EpsonEscvp21Instance, [])
