Vue.component('socket-card', {
	/* =====================================================================================
	 					Data are the attributes of the component
	 =====================================================================================*/
	data: function () {
		return {
			// Socket network related attributes
			socketAddress: 'ws://',
			socketSubprotocol: '',
			enableTLS: false,

			// Socket status related attributes
			status: 'disconnected',

			// UI related attributes
			connectClass: 'filled',
			connectText: 'connect',
			sendClass: 'not-filled',

			// Socket instance, to communicate
			socket: null,

			// Request and response content
			response : '',
			request: '',

			// Messages history related attributes
			requestHistory : [],
			requestHistoryIndex: 0,
			responseHistory: [],
			responseHistoryIndex: 0,
			requestResponseLinked: {},
			requestEditable: true,
			responseEditable: false,
			checkboxId: '',

			// Messaging manager related attributes
			currentMessagingManager: null,
			language: '0',
		}
	},
	/* =====================================================================================
	 					Props are data passed by the parent component
	 =====================================================================================*/
	props: {
		'color' : {
			type: String,
			required: true,
		}, 
		'name' : {
			type: String,
			required: true,
		},
		'messagingManagers': {
			type: Array,
			required: false,
		}
	},
	/* =====================================================================================
	 					The created method is one of the VueJs lifecycle methods
	 =====================================================================================*/
	created: function () {
		// When the component is created, we assign it a unique id
		this.checkboxId = this.generateUUID();
	},
	/* =====================================================================================
	 						ALL THE METHODS FOR THE COMPONENT
	 =====================================================================================*/
	methods: {
		/** 
		*	Toggle the connected state of the Websocket
		*/
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
		/** 
		*	Display the previous request and its associated response (if existing)
		*/
		previousRequest: function () {
			this.requestHistoryIndex--;
			this.request = this.requestHistory[this.requestHistoryIndex];
			this.showAssociatedResponse();
		},
		/** 
		*	Display the next request and its associated response (if existing)
		*/
		nextRequest: function () {
			this.requestHistoryIndex++;
			this.request = this.requestHistory[this.requestHistoryIndex];
			this.showAssociatedResponse();
		},
		/** 
		*	Clear the request message editor
		*/
		clearRequest: function () {
			this.request = '';
			this.requestHistoryIndex = this.requestHistory.length;
		},
		/** 
		*	Display in the response field the response associated to the request displayed
		*	in the request field.
		*/
		showAssociatedResponse() {
			// Check whether there is a response linked to the request. If so, show it.
			if (this.requestResponseLinked[this.request]) {
				this.goToResponse(this.requestResponseLinked[this.request]);
			}
		},
		/** 
		*	Display the given request in the request field
		*	@param request : the request to display in the request field
		*/
		goToRequest: function (request) {
			// Verify that the request exist
			if (this.requestHistory.indexOf(request) !== -1) {
				this.requestHistoryIndex = this.requestHistory.indexOf(request);
				this.request = this.requestHistory[this.requestHistoryIndex];
			}
		},
		/** 
		*	Display the previous response and its associated request (if existing)
		*/
		previousResponse: function () {
			this.responseHistoryIndex--;
			this.response = this.responseHistory[this.responseHistoryIndex];
			this.showAssociatedRequest();
		},
		/** 
		*	Display the next response and its associated request (if existing)
		*/
		nextResponse: function () {
			this.responseHistoryIndex++;
			this.response = this.responseHistory[this.responseHistoryIndex];
			this.showAssociatedRequest();
		},
		/** 
		*	Clear the response message editor
		*/
		clearResponse: function () {
			this.response = '';
			if (this.responseHistory.length != 0) {
				this.responseHistoryIndex = this.responseHistory.length;
			}
		},
		/** 
		*	Display in the request field the request associated to the response displayed
		*	in the response field.
		*/
		showAssociatedRequest: function () {
			// Check whether there is a request linked to the on-screen response. If so, show it.
			const index = Object.keys(this.requestResponseLinked).indexOf(this.response);
			if ( index !== -1 ) {
				this.requestHistoryIndex = index;
				this.request = this.requestHistory[index];
			}
		},
		/** 
		*	Display the given reponse in the response field
		*	@param response : the response to display in the request field
		*/
		goToResponse: function (response) {
			// Verify that the reponse exist
			if (this.responseHistory.indexOf(response) !== -1) {
				this.responseHistoryIndex = this.responseHistory.indexOf(response);
				this.response = this.responseHistory[this.responseHistoryIndex];
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
					msg = event.data;
					that.handleReceivedMessage(msg);
				}

				socket.onerror = function (event) {
					that.response = 'An error occured on socket';
					console.log(event);
					if(that.responseHistory.length != 0) { that.responseHistoryIndex++; }
				}

				socket.onclose = function (event) {
					that.status = 'disconnected';
					that.connectClass = 'filled';
					that.connectText = 'connect';
					that.sendClass = 'not-filled';
					that.response = `Socket closed with code ${event.code}\nReason : ${SOCKET_CODE[String(event.code)]}`;
					that.responseHistory.push(that.response);
					that.responseHistoryIndex = (that.responseHistory.length -1);
				}
			} catch (err) {
				this.responseHistory.push(err.message);
				this.response = err.message;
				this.socket = null;
			}
		},
		sendMessage: function () {
			if (this.socket !== null && this.socket.readyState === 1 && this.request !== '') {
				// We first check whether the messaging manager has a function to encode the message
				// that the user just typped.
				if (this.currentMessagingManager.prototype.hasOwnProperty('encodeBeforeSending')) {
					// Then we call the function that will encode and message and send it.
					const encodedMessage = this.currentMessagingManager.encodeBeforeSending(this.request);
					this.socket.send(encodedMessage);
				} else {
					this.socket.send(this.request);
				}
				// After that we verify if the user wants to store the raw or encoded version of 
				// the message and store the appropriate message.
				this.requestHistory.push(this.currentMessagingManager.storeEncodedMessage ? encodedMessage : this.request);
				this.requestHistoryIndex = this.requestHistory.length;
				this.request = '';
			}
		},
		handleReceivedMessage: function(message) {
			// We first check whether the messaging manager has a function to decode the message
			// that was just received.
			if (this.currentMessagingManager.prototype.hasOwnProperty('decodeOnReceive')) {
				// Then we call the function that will decode the message.
				const decodedMessage = this.currentMessagingManager.decodeOnReceive(message);
			}
			// After that we verify if the user wants to store the raw or encoded version of 
			// the message and store the appropriate message.
			this.response = this.currentMessagingManager.storeEncodedMessage ? decodedMessage : message
			this.responseHistory.push(this.response);
			this.requestResponseLinked[this.requestHistory[this.requestHistory.length-1]] = this.response;
			this.responseHistoryIndex = (this.responseHistory.length -1);
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
        toggleTLS: function() {
        	// this.enableTLS change after this function has been called
        	if (!this.enableTLS) {
        		this.socketAddress = this.socketAddress.replace('ws', 'wss');
        	} else {
        		this.socketAddress = this.socketAddress.replace('wss', 'ws');
        	}
        },
        toggleTlSFromText: function(event) {
        	// Set the value of socketAddress (default behavior)
        	this.socketAddress = event.target.value;

        	// Look at the address to determine wether the user wants to use TLS or not
        	const prefix = event.target.value.substring(0,3);
        	if (prefix === 'wss') { this.enableTLS = true; }
        	else { this.enableTLS = false; }
        },
        enterPressed: function(event) {
        	if (event.keyCode === 13 && this.status === 'disconnected') {
        		this.toggleConnect();
        		return false;
        	}
        },
        remove: function() {
        	if (this.status === 'connected') {
        		this.socket.close();
        	}
        	
        	this.$emit('remove');
        },
        selectedLanguage: function(event) {
        	if (event.srcElement.value !== 'add') {
        		this.language = parseInt(event.srcElement.value);
        		this.currentMessagingManager = this.messagingManagers[this.language];
        	} else if (event.srcElement.value === 'add') {
        		this.$emit('add-language');
        	}
        }
	},
	template: `<div class="socket-card" :class="color">
				<div class="name">{{name}}<span class="delete-button" @click="remove">x</span></div>
				<div class="connexion">
					<div class="address">
						<div class="label">Address</div>
						<input :value="socketAddress" @input="toggleTlSFromText" class="field" type="text" placeholder="ws://your-address" 
						:disabled="status === 'connected'" @keypress="enterPressed">
						<div class="subprotocol">
							<div class="label sub-protocol-label">Sub-protocol</div>
							<input v-model="socketSubprotocol" class="field-subprotocol" type="text" placeholder="(optional)" :disabled="status === 'connected'" @keypress="enterPressed">
						</div>
						<div class="language-selection">
							<select type="select" v-model="language" @input="selectedLanguage">
								<option disabled value="default">Please select the language</option>
								<option v-for="manager in messagingManagers" :value="messagingManagers.indexOf(manager)">{{ manager.name }}</option>
								<option value="add">Add...</option>
							</select>
						</div>
						
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
										<label :for="checkboxId" @click="toggleTLS"></label>
									</div>
									<label :for="checkboxId" class="checkbox-label" @click="toggleTLS">Use TLS protocol</label>
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
						<p class="message-label message-label-1">Request</p>
						<editor v-model="request" :readOnly="!requestEditable" :language="currentMessagingManager != null ? currentMessagingManager.editorLanguage : 'javascript'"></editor>
					</div>
				</div>
				<div class="response message">
					<div class="flex-space-between">
						<div>
							<button @click="previousResponse" :disabled="responseHistoryIndex <= 0">previous</button>
							<button @click="nextResponse" :disabled="responseHistoryIndex >= (responseHistory.length -1)">next</button>
						</div>
						<div>
							<button class="clear-button" @click="clearResponse">clear</button>
						</div>
					</div>
					<div>
						<p class="message-label message-label-2">Response</p>
						<editor v-model="response" :readOnly="!responseEditable" :language="currentMessagingManager != null ? currentMessagingManager.editorLanguage : 'javascript'"></editor>
					</div>
				</div>
			</div>`
});