Vue.component('add-button', {
	template: `<button class="add-button" :class="color" @click="add">
					<div class="text"><div class="valign">ADD</div></div>
				</button>`,
	props: ['color'],
	methods: {
		add: function () {
			this.$emit('add');
		}
	}
});