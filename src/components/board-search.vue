<template>
    <section class="board-search">
        <header>
            <h4>Available Boards</h4>
        </header>
        <input type="text" class="board-search-inp" v-model="search" />
        <div class="boards-list">
            <ul>
                <li
                    class="board-display"
                    v-for="board in boardToDisplay"
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
        </div>
    </section>
</template>
<script>

export default {
    name: 'board-serach',
    props: {
        filterBy: Object
    },
    data() {
        return {
            search: ''
        }
    },
    created() {
    },
    methods: {
        goToBoard(id) {
            this.$router.push(`/board/${id}`)
        }
    },
    computed: {
        boards() {
            return this.$store.getters.boards
        },
        boardToDisplay() {
            let boards = JSON.parse(JSON.stringify(this.boards));
            let regex;
            // const regex = new RegExp(this.filterBy.title, 'i');
            if (this.search) {
                regex = new RegExp(this.search, 'i');
            } else {
                regex = new RegExp(this.filterBy.title, 'i')
            }
            boards = boards.filter(board => regex.test(board.title));
            return boards
        }
    }
}
</script>
