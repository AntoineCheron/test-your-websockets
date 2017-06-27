const MessagingManager = {
	name: 'Json',
	editorLanguage: 'javascript',
	storeEncodedMessage: false,
	customAceEditorInstace: null,
	encodeBeforeSending: (inputMessage) => {
		// Code that transform the user-written message into the encoded message that should be send through the socket.
		return inputMessage;
	},
	decodeOnReceive: (receivedMessage) => {
		// Code that transform the received message into the message that will be displayed.
		return receivedMessage;
	},
};