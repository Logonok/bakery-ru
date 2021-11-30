'use strict';

Vue.component('ingredient-group', {
    props: {
        items: Array,
        required: Boolean,
        title: String
    },
    watch: {
        items () {
            console.log('iems');
        }
    },
    methods: {
        getSelectedIngredients () {
            return this.getRefArray('item').map(ref => ref.selected).filter(value => !!value);
        },
        onChangeIngredient () {
            this.$emit('change-ingredient', this.getPrice());
        },
        getPrice () {
            return this.getRefArray('item').reduce((sum, ref) => ref.getPrice() + sum, 0);
        },
        validate () {
            return this.validateRequired(...arguments)
                && this.validateInStock(...arguments);
        },
        validateInStock () {
            return this.validateItemsByMethod('validateInStock', ...arguments);
        },
        validateRequired () {
            return this.required
                ? this.validateItemsByMethod('validateRequired', ...arguments)
                : true;
        },
        validateItemsByMethod (name, ...params) {
            for (const ref of this.getRefArray('item')) {
                if (!ref[name].apply(ref, params)) {
                    return false;
                }
            }
            return true;
        }
    },
    template: '#ingredient-group'
});