<template>
    <section class="recent-boards-popup">
        <header>
            <p>Recent Boards</p>
            <span class="icon-cancel" @click="closePopup"></span>
        </header>
        <main>
            <ul>
                <li v-for="board in recentBoards" :key="board._id" @click="goToBoard(board._id)">
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
    name: 'recent-boards-popup',
    props: {
        user: Object,
    },
    data() {
        return {
            recentBoards: []
        }
    },
    async created() {
        await this.$store.dispatch({ type: 'loadBoards' })
        this.recentBoards = JSON.parse(JSON.stringify(this.user.recentBoards)).map(board => {
            const newBoard = this.getBoard(board)
            return newBoard
        })
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
        }

    },
    computed: {
        boards() {
            return this.$store.getters.boards
        }
    }
}
</script>
