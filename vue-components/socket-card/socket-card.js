Vue.component('socket-card', {
	props: ['color', 'name'],
	data: function () {
		return {
			status: 'disconnected',
			connectClass: 'filled',
			connectText: 'connect',
			sendClass: 'not-filled',
		}
	},
	methods: {
		toggleConnect: function () {
			alert('toggleConnect');
		},
		sendMessage: function () {
			alert('sendMessage');
		},
		previousRequest: function () {
			alert('previousRequest');
		},
		nextRequest: function () {
			alert('nextRequest');
		},
		clearRequest: function () {
			alert('clearRequest');
		},
		previousResponse: function () {
			alert('previousResponse');
		},
		nextResponse: function () {
			alert('nextResponse');
		},
		clearResponse: function () {
			alert('clearResponse');
		}
	},
	template: '<div class="w-6">\
				<div class="socket-card" v-bind:class="color">\
					<div class="name">{{name}}</div>\
					<div class="connexion">\
						<div class="address">\
							<div class="label">Address</div>\
							<input class="field" type="text" placeholder="ws://your-address">\
						</div>\
						<div class="socket-status">\
							<div class="status">Status : <span class="value">{{status}}</span></div>\
							<div class="buttons">\
								<button class="connect" :class="connectClass" v-on:click="toggleConnect">{{connectText}}</button>\
								<button class="send" :class="sendClass" v-on:click="sendMessage">send message</button>\
							</div>\
						</div>\
					</div>\
					<div class="request message">\
						<div class="flex-space-between">\
							<div>\
								<button v-on:click="previousRequest">previous</button>\
								<button v-on:click="nextRequest">next</button>\
							</div>\
							<div>\
								<button class="clear-button" v-on:click="clearRequest">clear</button>\
							</div>\
						</div>\
						<div>\
							<p class="message-label message-label-1">Message</p>\
							<textarea rows="11" cols="61"></textarea>\
						</div>\
					</div>\
					<div class="response message">\
						<div class="flex-space-between">\
							<div>\
								<button v-on:click="previousResponse">previous</button>\
								<button v-on:click="nextResponse">next</button>\
							</div>\
							<div>\
								<button class="clear-button" v-on:click="clearResponse">clear</button>\
							</div>\
						</div>\
						<div>\
							<p class="message-label message-label-2">Response</p>\
							<textarea rows="11" cols="61"></textarea>\
						</div>\
					</div>\
				</div>\
			</div>'
});