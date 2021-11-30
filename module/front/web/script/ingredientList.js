'use strict';

Vue.component('ingredient-list', {
    props: {
        id: String,
        required: Boolean,
        title: String,
        items: Array
    },
    data () {
        return {
            selected: ''
        };
    },
    watch: {
        selected () {
            this.$emit('change-ingredient');
        },
        items () {
            this.selected = '';
        }
    },
    methods: {
        getPrice () {
            return this.getSelectedItem()?.price || 0;
        },
        getSelectedItem (id) {
            for (const item of this.items) {
                if (item.id === this.selected) {
                    return item;
                }
            }
        },
        validateRequired () {
            if (!this.selected) {
                this.showError(`Не выбран обязательный ингредиент ${this.title}`);
                return false;
            }
            return true;
        },
        validateInStock (quantity) {
            const item = this.getSelectedItem();
            if (item && (isNaN(item.stock) || item.stock < quantity)) {
                this.showError(`Не хватает запаса ингредиента ${item.name}`);
                return false;
            }
            return true;
        }
    },
    template: '#ingredient-list'
});