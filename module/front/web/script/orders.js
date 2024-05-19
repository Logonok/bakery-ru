'use strict';

Vue.component('orders', {
    props: {
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
        empty () {
            return !this.items.length;
        }
    },
    async created () {
        this.$on('load', this.onLoad);
        await this.reload();
    },
    methods: {
        async reload () {
            await this.load(0);
        },
        async load (page) {
            const {pageSize} = this;
            const data = await this.fetchJson('list', {
                class: 'order',
                length: pageSize,
                start: page * pageSize,
                order: {_id: -1}
            });
            this.$emit('load', {...data, pageSize, page});
        },
        onLoad ({items}) {
            this.items = this.formatItems(items);
        },
        formatItems (items) {
            return items.map(item => ({
                id: item._id,
                price: Jam.FormatHelper.asCurrency(item.price),
                state: item._state_title || item._state,
                date: Jam.FormatHelper.asDatetime(item._createdAt)
            }));
        }
    },
    template: '#orders'
});