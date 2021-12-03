'use strict';

Vue.mixin({
    data () {
        return {
            loading: false
        };
    },
    computed: {
        isGuest () {
            return !this.$root.userId;
        }
    },
    mounted () {
        this.translateElement();
    },
    updated () {
        this.translateElement();
    },
    methods: {
        getDataUrl (action) {
            return `${this.$root.dataUrl}/${action}`;
        },
        getThumbnailUrl (id, size = '') {
            return id ? `${this.$root.thumbnailUrl}&s=${size}&id=${id}` : null;
        },
        getRefArray (name) {
            const data = this.$refs[name];
            return Array.isArray(data) ? data : data ? [data] : [];
        },
        toOrder () {
            this.$root.$emit('order', ...arguments);
        },
        toOrders () {
            this.$root.$emit('orders', ...arguments);
        },
        toProduct () {
            this.$root.$emit('product', ...arguments);
        },
        toProducts () {
            this.$root.$emit('products');
        },
        fetchJson () {
            return this.fetchByMethod('getJson', ...arguments);
        },
        fetchText () {
            return this.fetchByMethod('getText', ...arguments);
        },
        fetchByMethod (name, action, data) {
            try {
                const csrf = this.$root.csrf;
                this.loading = true;
                return (new Jam.Fetch)[name](this.getDataUrl(action), {csrf, ...data});
            } finally {
                this.loading = false;
            }
        },
        requireAuth () {
            if (this.isGuest) {
                location.assign(this.$root.authUrl);
                return false;
            }
            return true;
        },
        translateElement () {
            Jam.i18n.translate($(this.$el));
        },
        showError () {
            Jam.dialog.error(...arguments);
        }
    }
});