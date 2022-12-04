<template>
    <section class="board-header-favorite" @click="toggleFavorite" :title="starTxt">
        <i :class="favoriteIcon"></i>
    </section>
</template>


<script>
export default {
    name: 'board-header-favorite',
    props: {
        favorite: Boolean
    },
    data() {
        return {
            isFavorite: this.favorite,
            isHovered: false
        }
    },
    watch: {
        '$route.params.boardId': {
            handler(newId, oldId) {
                const user = this.$store.getters.user;
                this.isFavorite = user?.favorites.some(favoriteId => favoriteId === this.$route.params.boardId)
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        toggleFavorite() {
            this.isFavorite = !this.isFavorite;
            this.$emit('toggleFavorite', this.isFavorite);
        }
    },
    computed: {
        favoriteIcon() {
            return this.isFavorite ? 'fa-solid fa-star' : 'fa-regular fa-star';
        },
        starTxt() {
            const starOrUnstar = this.isFavorite ? 'unstar' : 'star';
            const addedOrRemoved = this.isFavorite ? 'removed from' : 'added to';
            return `Click to ${starOrUnstar} this board. It will be ${addedOrRemoved} your starred list.`;
        }
    }
}
</script>

<style>
</style>