'use strict';

Vue.component('order', {
    props: {
        activePage: String
    },
    data () {
        return {
            id: null,
            state: null,
            stateTitle: null,
            items: [],
            price: 0,
            date: null
        };
    },
    computed: {
        active () {
            return this.activePage === 'order';
        },
        isDraft () {
            return this.state === 'draft';
        },
        isNew () {
            return this.state === 'new';
        }
    },
    async created () {
        this.$root.$on('order', this.onOrder);
        this.$on('load', this.onLoad);
    },
    methods: {
        canAddMore () {
            return this.isDraft;
        },
        canConfirm () {
            return this.isDraft && this.items.length;
        },
        canModify () {
            return this.isNew;
        },
        canDelete () {
            return this.isDraft || this.isNew;
        },
        onAddMore () {
            this.$root.$emit('products');
        },
        onConfirm () {
            this.transit('confirm');
        },
        onModify () {
            this.transit('modify');
        },
        async transit (transition) {
            try {
                await this.fetchText('transit', {
                    class: 'order',
                    id: this.id,
                    transition
                });
                await this.reload();
            } catch (err) {
                this.showError(err);
            }
        },
        async onDelete () {
            try {
                await Jam.dialog.confirmDeletion('Удалить этот заказ окончательно?');
                await this.fetchText('delete', {
                    class: 'order',
                    id: this.id
                });
                this.$root.$emit('orders');
            } catch (err) {
                this.showError(err);
            }
        },
        onDeleteItem (event) {
            this.deleteItem(event.currentTarget.dataset.id);
        },
        async deleteItem (id) {
            await Jam.dialog.confirmDeletion('Удалить этот элемент из заказа?');
            await this.fetchText('delete', {
                class: 'orderItem',
                id
            });
            await this.reload();
        },
        onOrder (id) {
            this.load(id);
        },
        async reload () {
            await this.load(this.id);
        },
        async load (id) {
            const data = await this.fetchJson('read', {
                class: 'order',
                view: 'withItems',
                id
            });
            this.$emit('load', data);
        },
        onLoad (data) {
            this.id = data._id;
            this.state = data._state;
            this.stateTitle = data._state_title;
            this.price = data.price;
            this.date = Jam.FormatHelper.asDatetime(data._createdAt);
            this.items = this.formatItems(data.items);
        },
        formatItems (items) {
            return items.map(item => ({
                id: item._id,
                name: item.product.name,
                picture: item.product.picture ? this.formatPicture(item.product.picture) : null,
                price: item.price,
                quantity: item.quantity,
                ingredients: item.ingredients
            }));
        },
        formatPicture (id) {
            return {
                url: this.getThumbnailUrl(id, 'xs')
            };
        }
    },
    template: '#order'
});