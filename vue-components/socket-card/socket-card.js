Vue.component('socket-card', {
	props: {
		'color' : {
			type: String,
			required:true,
		}, 
		'name' : {
			type: String,
			required: true,
		}
	},
	created: function () {
		this.checkboxId = this.generateUUID();
	},
	data: function () {
		return {
			socketAddress: '',
			socketSubprotocol: '',
			status: 'disconnected',
			connectClass: 'filled',
			connectText: 'connect',
			sendClass: 'not-filled',
			socket: null,
			response : '',
			request: '',
			requestHistory : [],
			requestHistoryIndex: 0,
			responseHistory: [],
			responseHistoryIndex: 0,
			requestEditable: true,
			responseEditable: false,
			checkboxId: '',
		}
	},
	methods: {
		toggleConnect: function () {
			if (this.socket === null || this.status === 'disconnected') {
				// Setting the subprotocol. Support multiple protocol if user enter the list as a JSON array
				let subprotocol = null;
				if (this.socketSubprotocol !== '') {
					try {
						subprotocol = JSON.parse(this.socketSubprotocol);
						subprotocol = JSON.stringify(subprotocol);
					} catch (err) {
						subprotocol = this.socketSubprotocol;
					}
				}
				// Create socket and connect
				this.socket = this.createWebsocket(this.socketAddress, subprotocol);
			} else if(this.status === 'connected') {
				this.socket.close(1000, 'User decided to close socket');
				this.socket = null;
			}
		},
		sendMessage: function () {
			if (this.socket !== null && this.socket.readyState === 1) {
				this.socket.send(this.request);
				this.requestHistory.push(this.request);
				this.requestHistoryIndex = this.requestHistory.length;
				this.request = '';
			}
		},
		previousRequest: function () {
			this.requestHistoryIndex--;
			this.request = this.requestHistory[this.requestHistoryIndex];
		},
		nextRequest: function () {
			this.requestHistoryIndex++;
			this.request = this.requestHistory[this.requestHistoryIndex];
		},
		clearRequest: function () {
			this.request = '';
			this.requestHistoryIndex = this.requestHistory.length;
		},
		previousResponse: function () {
			this.responseHistoryIndex--;
			this.response = this.responseHistory[this.responseHistoryIndex -1];
		},
		nextResponse: function () {
			this.responseHistoryIndex++;
			this.response = this.responseHistory[this.responseHistoryIndex-1];
		},
		clearResponse: function () {
			this.response = '';
			if (this.responseHistory.length != 0) {
				this.responseHistoryIndex = this.responseHistory.length + 1;
			}
		},
		createWebsocket: function (address) {
			let that = this;
			try {
				const socket = new WebSocket(address, 'echo-protocol');

				socket.onopen = function () {
					that.socket = socket;
					that.status = 'connected';
					that.connectClass = 'not-filled';
					that.connectText = 'disconnect';
					that.sendClass = 'filled';
					that.response = 'Successfully connected !';
					if(that.responseHistory.length != 0) { that.responseHistoryIndex++; }
				}

				socket.onmessage = function (event) {
					let msg = '';
					try {
						msg = JSON.parse(event.data);
						msg = JSON.stringify(msg, null, '\t');
					} catch (err) {
						msg = event.data;
					}
					
					that.response = msg;
					that.responseHistory.push(msg);
					that.responseHistoryIndex = that.responseHistory.length;
				}

				socket.onerror = function (event) {
					that.response = 'An error occured on socket';
					if(that.responseHistory.length != 0) { that.responseHistoryIndex++; }
				}

				socket.onclose = function (event) {
					that.status = 'disconnected';
					that.connectClass = 'filled';
					that.connectText = 'connect';
					that.sendClass = 'not-filled';
					that.response = `Socket closed with code ${event.code}, reason : ${event.reason}`;
					if(that.responseHistory.length != 0) { that.responseHistoryIndex++; }
				}
			} catch (err) {
				this.response = err.message;
				this.socket = null;
			}
		},
		updateRequest: function(value) {
			this.request = value;
		},
		updateResponse: function(value) {
			this.response = value;
		},
		generateUUID: function() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
             });
            return uuid;
        },
	},
	template: `<div class="w-6">
				<div class="socket-card" :class="color">
					<div class="name">{{name}}</div>
					<div class="connexion">
						<div class="address">
							<div class="label">Address</div>
							<input @input="toggleTls(value)" class="field" type="text" placeholder="ws://your-address" 
							:disabled="status === 'connected'">
							<div class="label sub-protocol-label">Sub-protocol</div>
							<input v-model="socketSubprotocol" class="field-subprotocol" type="text" placeholder="(optional)" 
							:disabled="status === 'connected'">
						</div>
						<div class="socket-status">
							<div class="status">Status : <span class="value">{{status}}</span></div>
							<div class="buttons">
								<button class="connect" :class="connectClass" @click="toggleConnect">{{connectText}}</button>
								<button class="send" :class="sendClass" @click="sendMessage" :disabled="socket === null || status === 'disconnected'">send message</button>
							</div>
							<div class="use-tls">
								<div>
									<div>
										<div class="tls-checkbox">
											<input v-model="enableTLS" type="checkbox" :id="checkboxId" :disabled="status === 'connected'">
											<label :for="checkboxId"></label>
										</div>
										<label :for="checkboxId" class="checkbox-label">Use TLS protocol</label>
									</div>
								</div>
								
							</div>
						</div>
					</div>
					<div class="request message">
						<div class="flex-space-between">
							<div>
								<button @click="previousRequest" :disabled="requestHistoryIndex <= 0">previous</button>
								<button @click="nextRequest" :disabled="requestHistoryIndex >= requestHistory.length-1">next</button>
							</div>
							<div>
								<button class="clear-button" @click="clearRequest">clear</button>
							</div>
						</div>
						<div>
							<p class="message-label message-label-1">Message</p>
							<editor v-model="request" :readOnly="!requestEditable"></editor>
						</div>
					</div>
					<div class="response message">
						<div class="flex-space-between">
							<div>
								<button @click="previousResponse" :disabled="responseHistoryIndex <= 1">previous</button>
								<button @click="nextResponse" :disabled="responseHistoryIndex >= responseHistory.length">next</button>
							</div>
							<div>
								<button class="clear-button" @click="clearResponse">clear</button>
							</div>
						</div>
						<div>
							<p class="message-label message-label-2">Response</p>
							<editor v-model="response" :readOnly="!responseEditable"></editor>
						</div>
					</div>
				</div>
			</div>`
});