'use strict';

Vue.component('order', {
    props: {
        order: String
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
        isDraft () {
            return this.state === 'draft';
        },
        isNew () {
            return this.state === 'new';
        }
    },
    async created () {
        this.$on('load', this.onLoad);
        await this.reload();
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
            this.toProducts();
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
                    id: this.order
                });
                this.toOrders();
            } catch (err) {
                this.showError(err);
            }
        },
        onDeleteItem (id) {
            this.deleteItem(id);
        },
        async deleteItem (id) {
            await Jam.dialog.confirmDeletion('Удалить этот элемент из заказа?');
            await this.fetchText('delete', {
                class: 'orderItem',
                id
            });
            await this.reload();
        },
        async reload () {
            await this.load(this.order);
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
            this.price = Jam.FormatHelper.asCurrency(data.price);
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