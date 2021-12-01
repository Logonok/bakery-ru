'use strict';

Vue.component('products', {
    props: {
        pageSize: {
            type: Number,
            default: 6
        }
    },
    data () {
        return {
            loading: true,
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
        await this.load(0);
    },
    methods: {
        onProduct (event) {
            this.toProduct(event.currentTarget.dataset.id);
        },
        async load (page) {
            const data = await this.fetchJson('list', {
                class: 'product',
                view: 'publicList',
                length: this.pageSize,
                start: page * this.pageSize
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
                name: item.name,
                description: item.description,
                picture: item.picture ? this.formatPicture(item.picture) : null
            }));
        },
        formatPicture (id) {
            return {
                url: this.getThumbnailUrl(id, 'sm')
            };
        }
    },
    template: '#products'
});