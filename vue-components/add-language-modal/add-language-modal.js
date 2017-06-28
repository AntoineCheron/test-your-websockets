Vue.component('add-language-modal', {
	data: function() {
		return {
			file: null,
			encodeBeforeSending: '(inputMessage) => {\
				\n	// Code that transform the user-written message into the encoded message that should be send through the socket.\
				\n	return encodedMessage;\
			\n}',
			decodeOnReceive: '(receivedMessage) => {\
				\n	// Code that transform the received message into the message that will be displayed.\
				\n	return decodedMessage;\
			\n}',
			messagingManager: {
				name: '',
				editorLanguage: '', // Search for the ace mode that you would like to use. We take care of the beginning part /ace/mode
				storeEncodedMessage: false,
				customAceEditorInstace: null, // Ace editor instance : https://ace.c9.io/#nav=api&api=editor
				encodeBeforeSending: '',
				decodeOnReceive: '',
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
			// Unlock the scroll of the background part (which become the main part)
			document.getElementsByTagName("body")[0].style.overflow = '';

			let messagingManager = null;

			if (this.file != null) {
				console.log(this.file);
				// TODO
			} else {
				// Retrieve the encode before sending function written by the user
				if (!(this.encodeBeforeSending.length === 0 || !this.encodeBeforeSending.trim())) {
					let ebs = this.encodeBeforeSending;
					ebs = ebs.substring(ebs.indexOf('{')+1, ebs.lastIndexOf('}'));
					// Verify that the string doesn't contains only white-spaces
					if (!(ebs.length === 0 || !ebs.trim())) {
						this.messagingManager.encodeBeforeSending = new Function('inputMessage', ebs);
					}
				}

				// Retrieve the decode on receive function written by the user
				if (!(this.decodeOnReceive.length === 0 || !this.decodeOnReceive.trim())) {
					let dor = this.decodeOnReceive;
					dor = dor.substring(dor.indexOf('{')+1, dor.lastIndexOf('}'));
					// Verify that the string doesn't contains only white-spaces
					if (!(dor.length === 0 || !dor.trim())) {
						this.messagingManager.decodeOnReceive = new Function('receivedMessage', dor);
					}
				}

				messagingManager = this.messagingManager;
				console.log(messagingManager);
			}

			this.$emit('new-messaging-manager', messagingManager);
			this.$emit('input', false);
		},
		fileUploaded (e) {
			// Retrieve the file
      		this.file = e.target.files[0] || e.dataTransfer.files[0];
		}
	},
	template: `
	<div class="modal-background" :class="!value ? 'hide' : 'show'">
		<div class="modal">
			<h1>Add new language</h1>
			<button id="saveNewMessagingManagerButton" @click="close()">Save</button>
			<h3>To add a new messaging manager, upload a .js file based on the template described in this 
			<a href="https://github.com/AntoineCheron/test-your-websockets/blob/master/README.md">readme</a>, or complete the form below.</h3>
			<div class="inputfile">
				<input @change="fileUploaded" type="file" name="file" id="uploadMessagingManager" disabled></input>
				<label for="uploadMessagingManager">
					<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" x="0px" y="0px" viewBox="0 0 1084.7847 1390.21875" enable-background="new 0 0 2000 2000" xml:space="preserve"><path style="" d="M 542.479,0 C 531.267,0 520.99,3.915 512.903,10.434 L 261.571,193.228 c -21.129,15.329 -25.701,44.809 -10.422,65.892 15.282,21.033 44.852,25.748 65.841,10.372 l 178.328,-129.69 0,414.469 c 0,26.035 21.08,47.165 47.161,47.165 26.083,0 47.163,-21.13 47.163,-47.165 l 0,-414.453 178.232,129.674 c 8.3954,6.086 18.0684,9.014 27.7364,9.014 14.574,0 28.91,-6.7 38.201,-19.386 15.374,-21.083 10.66,-50.563 -10.422,-65.892 L 570.896,9.52 C 562.996,3.548 553.16,0 542.479,0 Z m -305.25,487.309 c -12.067,0.177 -24.069,4.964 -33.148,14.325 L 15.107,696.544 C 5.815,705.162 0,717.47 0,731.137 l 0,333.873 c 0,26.035 21.083,47.165 47.164,47.165 l 990.4434,0 c 26.082,0 47.164,-21.083 47.164,-47.165 l 0,-332.751 c 0.157,-6.621 -1.076,-13.269 -3.7,-19.478 0,-0.02 -0.01,-0.05 -0.01,-0.07 -0.567,-1.334 -1.197,-2.646 -1.893,-3.934 -0.04,-0.07 -0.08,-0.139 -0.124,-0.21 -0.314,-0.577 -0.643,-1.147 -0.985,-1.712 -0.06,-0.109 -0.139,-0.216 -0.197,-0.322 -0.321,-0.523 -0.652,-1.039 -0.995,-1.551 -0.08,-0.132 -0.177,-0.261 -0.261,-0.39 -0.32,-0.469 -0.65,-0.932 -0.989,-1.391 -0.176,-0.229 -0.341,-0.453 -0.512,-0.678 -0.25,-0.328 -0.504,-0.652 -0.762,-0.973 -0.267,-0.332 -0.542,-0.657 -0.817,-0.981 -0.215,-0.253 -0.429,-0.506 -0.651,-0.755 -0.38,-0.427 -0.772,-0.845 -1.169,-1.261 -0.08,-0.08 -0.139,-0.165 -0.225,-0.245 l -0.502,-0.52 c 0,-0.02 -0.01,-0.03 -0.04,-0.04 L 880.8854,501.631 c -18.16,-18.723 -48.059,-19.097 -66.688,-1.033 -18.676,18.111 -19.15,48.011 -0.99,66.687 l 113.077,116.686 -195.2374,0 c -26.082,0 -47.164,21.13 -47.164,47.164 l 0,66.688 -282.983,0 0,-66.688 c 0,-26.034 -21.082,-47.164 -47.164,-47.164 l -195.056,0 113.085,-116.641 c 18.158,-18.676 17.686,-48.529 -0.99,-66.687 -9.339,-9.078 -21.473,-13.514 -33.54,-13.336 z m -142.9,290.992 212.239,0 0,19.524 c 0,52.022 42.352,94.326 94.326,94.326 l 282.983,0 c 52.069,0 94.3294,-42.304 94.3294,-94.326 l 0,-19.524 212.239,0 0,239.541 -896.1164,0 0,-239.541 z"/></svg>
					Choose a file
				</label>
			</div>
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
					<editor v-model="encodeBeforeSending" :read-only="false" language="javascript"></editor>
				</div>
				<div>
					<label>Decode on receive function</label>
					<editor v-model="decodeOnReceive" :read-only="false" language="javascript"></editor>
				</div>
			</form>
		</div>
	</div>`
});