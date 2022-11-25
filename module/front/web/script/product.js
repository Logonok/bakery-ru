'use strict';

Vue.component('product', {
    props: {
        product: String
    },
    data () {
        return {
            id: null,
            name: null,
            description: null,
            picture: null,
            price: 0,
            stock: 0,
            ingredientLists: [],
            requiredIngredientLists: [],
            optionalIngredientLists: [],
            quantity: 1,
            requiredGroupPrice: 0,
            optionalGroupPrice: 0
        };
    },
    computed: {
        totalPrice () {
            const total = this.price + this.requiredGroupPrice + this.optionalGroupPrice;
            return Jam.FormatHelper.asCurrency(total * this.quantity);
        }
    },
    async created () {
        this.$on('load', this.onLoad);
        this.load(this.product);
    },
    methods: {
        onChangeRequiredIngredient (value) {
           this.requiredGroupPrice = value;
        },
        onChangeOptionalIngredient (value) {
           this.optionalGroupPrice = value;
        },
        async onOrder () {
            if (this.requireAuth() && this.validate()) {
                const pending = await this.getPendingOrder();
                if (!pending) {
                    await this.createOrder();
                } else if (pending._state === 'draft') {
                    await this.createOrderItem(pending._id);
                } else {
                    this.waitOrder(pending._id);
                }
            }
        },
        async getPendingOrder () {
            const data = await this.fetchJson('list', {
                class: 'order',
                view: 'pending'
            });
            return data?.items?.[0];
        },
        async createOrder () {
            try {
                const id = await this.fetchText('create', {
                    class: 'order'
                });
                await this.createOrderItem(id);
            } catch (err) {
                this.showError(err);
            }
        },
        async createOrderItem (order) {
            const data = {
                product: this.id,
                quantity: this.quantity,
                ingredients: this.getSelectedIngredients()
            };
            const master = {
                class: 'order',
                id: order,
                attr: 'items'
            };
            try {
                const id = await this.fetchText('create', {
                    class: 'orderItem',
                    master,
                    data
                });
                this.toOrder(order);
            } catch (err) {
                this.showError(err);
            }
        },
        getSelectedIngredients () {
            return [
                ...this.$refs.requiredGroup.getSelectedIngredients(),
                ...this.$refs.optionalGroup.getSelectedIngredients()
            ];
        },
        waitOrder (order) {
            this.showError('Ваш текущий заказ ожидает выполнения...');
            this.toOrder(order);
        },
        validate () {
            return this.validateQuantity()
                && this.validateGroup(this.$refs.requiredGroup)
                && this.validateGroup(this.$refs.optionalGroup);
        },
        validateQuantity () {
            if (!Number.isInteger(this.quantity)) {
                this.showError('Количество должно быть целым');
                return false;
            }
            if (this.quantity < 1) {
                this.showError('Количество должно быть больше 0');
                return false;
            }
            if (this.quantity > this.stock) {
                this.showError('Не хватает запаса продукта');
                return false;
            }
            return true;
        },
        validateGroup (ref) {
            return ref.validate(this.quantity);
        },
        async load (id) {
            const data = await this.fetchJson('read', {
                class: 'product',
                view: 'public',
                id
            });
            this.$emit('load', data);
        },
        onLoad (data) {
            this.id = data._id;
            this.name = data.name;
            this.description = data.description;
            this.picture = data.picture ? this.formatPicture(data.picture) : null;
            this.price = data.price;
            this.stock = data.stock;
            this.ingredientLists = this.formatIngredientLists(data.ingredientLists);
            this.requiredIngredientLists = this.ingredientLists.filter(item => item.required);
            this.optionalIngredientLists = this.ingredientLists.filter(item => !item.required);
            this.quantity = 1;
            this.requiredGroupPrice = 0;
            this.optionalGroupPrice = 0;

        },
        formatPicture (id) {
            return {
                url: this.getThumbnailUrl(id, 'lg')
            };
        },
        formatIngredientLists (items) {
            return items.map(item => ({
                id: item._id,
                name: item.name,
                description: item.description,
                required: item.required,
                ingredients: this.formatIngredients(item.ingredients)
            }));
        },
        formatIngredients (items) {
            return items.map(item => ({
                id: item._id,
                name: item.name,
                description: item.description,
                price: item.price,
                stock: item.stock
            }));
        }
    },
    template: '#product'
});