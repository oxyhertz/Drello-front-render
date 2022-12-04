<template>
    <section>
        <div @click="setComment" class="comment-save">
            <button class="save">Save</button>
        </div>
        <div class="comment-actions flex">
            <span class="icon-attachment"></span>
            <span class="icon-find-members"></span>
            <span class="icon-emojis"></span>
            <span class="title-icon"></span>
        </div>
    </section>
</template>
<script>
export default {
    props: {
        pp: String,
    },
    created() {

    },
    methods: {
        setComment() {
            if (this.pp) {
                this.$emit('updateItem', this.pp, false);
            }
            this.$emit('addComment');
        }
    },
    components: {
    }
}
</script>
