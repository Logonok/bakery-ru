'use strict';

Vue.component('orders', {
    props: {
        activePage: String,
        pageSize: {
            type: Number,
            default: 10
        }
    },
    data () {
        return {
            items: []
        };
    },
    computed: {
        active () {
            return this.activePage === 'orders';
        },
        empty () {
            return !this.items.length;
        }
    },
    async created () {
        this.$root.$on('orders', this.reload.bind(this));
        this.$on('load', this.onLoad);
    },
    methods: {
        onOrder (event) {
            this.$root.$emit('order', event.currentTarget.dataset.id);
        },
        async reload () {
            await this.load(0);
        },
        async load (page) {
            const data = await this.fetchJson('list', {
                class: 'order',
                length: this.pageSize,
                start: page * this.pageSize,
                order: {_id: -1}
            });
            const pageSize = this.pageSize;
            this.$emit('load', {...data, pageSize, page});
        },
        onLoad ({items}) {
            this.items = this.formatItems(items);
        },
        formatItems (items) {
            return items.map(item => ({
                id: item._id,
                price: item.price,
                state: item._state_title || item._state,
                date: Jam.FormatHelper.asDatetime(item._createdAt)
            }));
        }
    },
    template: '#orders'
});