<template>
    <ul class="board-list">
        <board-preview
            v-for="board in boards"
            @toggleFavorite="toggleFavorite"
            :board="board"
            :key="board"
            @click="moveToBoard(board._id)"
        />
    </ul>
</template>

<script>
import boardPreview from './board-preview.vue'

export default {
    name: 'board-list',
    emits: ['toggleFavorite'],
    props: {
        boards: Array,
    },
    data() {
        return {
        }
    },
    created() {
    },
    methods: {
        moveToBoard(id) {
            this.$router.push(`/board/${id}`)
        },
        toggleFavorite(id) {
            this.$emit('toggleFavorite', id);
        }
    },
    components: {
        boardPreview
    }
}
var img = new Image()
img.onload = () => {
}
img.src = 'img/1.jpg'
</script>