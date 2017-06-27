Vue.component('add-language-modal', {
	data: function() {
		return {
			file: null,
			messagingManager: {
				name: '',
				editorLanguage: '', // Search for the ace mode that you would like to use. We take care of the beginning part /ace/mode
				storeEncodedMessage: false,
				customAceEditorInstace: null, // Ace editor instance : https://ace.c9.io/#nav=api&api=editor
				encodeBeforeSending: (inputMessage) => {
					// Code that transform the user-written message into the encoded message that should be send through the socket.
					return encodedMessage;
				},
				decodeOnReceive: (receivedMessage) => {
					// Code that transform the received message into the message that will be displayed.
					return decodedMessage;
				},
			},
		}
	},
	props: {
		'value': {
			required: false,
			default: false,
			type: Boolean
		},
	},
	methods: {
		close: function() {
			this.$emit('input', false);
		}
	},
	template: `
	<div class="modal-background" :class="!value ? 'hide' : 'show'">
		<div class="modal">
			<h1>Add new language</h1>
			<button id="saveNewMessagingManagerButton" @click="close()">Save</button>
			<h3>To add a new messaging manager, upload a .js file based on the template described in the readme, or 
			complete the form below.</h3>
			<input type="file" id="uploadMessagingManager"></input>
			<form>
				<div class="text-field">
					<label for="name">Name</label>
					<input type="text" placeholder="name" v-model="messagingManager.name" name="name" id="name">
				</div>
				<div class="text-field">
					<label for="editorLanguage">Language on the editor</label>
					<input type="text" placeholder="language" v-model="messagingManager.editorLanguage" name="editorLanguage"
					id="editorLanguage">
				</div>
				<div>
					<label>Encode before sending function</label>
					<editor v-model="messagingManager.encodeBeforeSending" :read-only="false" language="javascript"></editor>
				</div>
				<div>
					<label>Decode on receive function</label>
					<editor v-model="messagingManager.decodeOnReceive" :read-only="false" language="javascript"></editor>
				</div>
			</form>
		</div>
	</div>`
});