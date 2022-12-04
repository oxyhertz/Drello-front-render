<template>
    <section class="favorite-boards-popup">
        <header>
            <p>Favorite Boards</p>
            <span class="icon-cancel" @click="closePopup"></span>
        </header>
        <main>
            <ul>
                <li
                    v-for="board in favBoards.flat()"
                    :key="board._id"
                    @click="goToBoard(board._id)"
                >
                    <div
                        class="board-bg"
                        :style="{ 'background-color': board.style.bgColor, 'background-image': 'url(' + board.style.bgImg + ')' }"
                    ></div>
                    <p>{{ board.title }}</p>
                </li>
            </ul>
        </main>
    </section>
</template>
<script>
export default {
    name: 'favorite-boards-popup',
    props: {
        user: Object,
    },
    data() {
        return {
            favoriteBoards: []
        }
    },
    methods: {
        getBoard(id) {
            const board = this.boards.find(board => board._id === id);
            return board
        },
        goToBoard(id) {
            this.$router.push(`/board/${id}`)
        },
        closePopup() {
            this.$emit('closePopup')
        },

    },
    computed: {
        boards() {
            return this.$store.getters.boards
        },
        users() {
            return this.$store.getters.user
        },
        favBoards() {
            return this.user.favorites.map(boardId => {
                const board = this.boards.filter(board => board._id === boardId)
                return board
            })
        }
    }
}
</script>
