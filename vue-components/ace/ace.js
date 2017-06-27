Vue.component('editor', {
    template:   '<div :id="uuid" class="editor"></div>',
    created: function () {
        this.uuid = this.generateUUID();
    },
    mounted: function() {
        const that = this;
        this.editor = ace.edit(this.uuid);
        this.editor.setTheme("ace/theme/test_your_websocket_custom");
        this.editor.getSession().setMode(`ace/mode/${this.language}`);
        this.editor.setReadOnly(this.readOnly);
        this.editor.getSession().on('change', () => { that.editorValueChanged(); });
        this.editor.$blockScrolling = Infinity
    },
    props : {
        'value': {
            required: false,
        }, 
        'readOnly' : {
            type: Boolean,
            required: true
        },
        'language': {
            required: false,
            type: String,
            default: 'javascript'
        },
    },
    watch: {
        value: function(val) {
            if (this.editor != '') { 
                // Get the cursor position
                const position = this.editor.getCursorPosition();

                // Change the value on the editor
                this.editor.getSession().setValue(val); 

                // Move back the cursor at the position it was before the change
                this.editor.selection.moveTo(position.row, position.column);

            }
        },
        language: function(val) {
            this.editor.getSession().setMode(`ace/mode/${val}`);
        },
    },
    data () {
        return {
            uuid : '',
            editor : '',
        }
    },
    methods : {
        editorValueChanged: function() {
            this.$emit('input', this.editor.getSession().getValue());
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
    }
});