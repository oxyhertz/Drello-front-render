<template>
    <li :style="boardStyle" v-if="board" :title="board.title">
        <div class="preview-content">
            <h2>{{ board.title }}</h2>
            <section class="star" @click.stop="toggleFavorite(board._id)" :title="starTxt">
                <i
                    v-if="!user.favorites?.includes(board._id)"
                    class="fa-regular fa-star white-font empty-star"
                ></i>
                <i v-else class="fa-solid fa-star"></i>
            </section>
        </div>
        <div class="small-overlay"></div>
    </li>
</template>

<script>
export default {
    name: 'board-preview',
    emits: ["toggleFavorite"],
    props: {
        board: Object
    },
    methods: {
        toggleFavorite(id) {
            this.$emit('toggleFavorite', id);
        }
    },
    computed: {
        boardStyle() {
            let style = {
                'background-color': this.board.style.bgColor ? this.board.style.bgColor : '',
                'background-image': this.board.style.bgImg ? `url(${this.board.style.bgImg})` : ''
            }
            return style
        },
        user() {
            return this.$store.getters.user;

        },
        starTxt() {
            const isUserFavorite = this.user.favorites?.includes(this.board._id);
            const starOrUnstar = isUserFavorite ? 'unstar' : 'star';
            const addedOrRemoved = isUserFavorite ? 'removed from' : 'added to';
            return `Click to ${starOrUnstar} this board. It will be ${addedOrRemoved} your starred list.`;
        }
    }
}
</script>