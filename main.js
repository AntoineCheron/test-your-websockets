var app = new Vue({
  el: '#app',
  data () {
  	return {
  		sockets : [],
  		cardColors : ['red', 'blue', 'orange', 'green', 'purple', 'dark-grey'],
  		buttonColor : 'red',
  		lastIndex: 0,
      messagingManagerNames: ['json'],
      messagingManagers: [],
      displayAddLanguageModal: false
  	}
  },
  created () {
    // Download each messaging manager contained into the array messagingManagerNames
    this.messagingManagerNames.forEach((name) => {
      this.addMessagingManager(name);
    });

    // Add a first card
    this.addSocket();
  },
  methods: {
  	addSocket: function() {
  		// Retrieve the name and color information for the socket object
  		const name = `Socket ${this.lastIndex + 1}`;
  		const color = `${this.cardColors[(this.lastIndex) % this.cardColors.length]}-card`;

  		// Create the socket object
  		const socket = {
  			'name' : name,
  			'color' : color,
  		};

  		// Add the socket into the array, it will automatically add it to the view
  		this.sockets.push(socket);

  		// Change the color of the add-button
  		this.lastIndex++;
  		this.buttonColor = this.cardColors[this.lastIndex % this.cardColors.length];
  	},
    deleteSocket: function(socket) {
      const i = this.sockets.indexOf(socket);
      this.sockets.splice(i, 1);
    },
    addMessagingManager: function(name) {
      const link = `scripts/messaging-managers/${name}.js`
      include(link, function() {
        app.receivedMessageManager(MessagingManager);
      });
    },
    receivedMessageManager: function(manager) {
      this.messagingManagers.push(manager);
    },
    addLanguage: function () {
      this.displayAddLanguageModal = true;
      // Lock the scroll on the background part while working on the add language card
      document.getElementsByTagName("body")[0].style.overflow = 'hidden';
    },
    newMessagingManager: function(manager) {
      if (manager !== null) {
        this.messagingManagerNames.push(manager.name);
        this.receivedMessageManager(manager);
      }
    }
  },
});