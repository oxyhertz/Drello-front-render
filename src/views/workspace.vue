<template lang="">
    <section class="workspace-container main-layout">
        <h2>Workspace</h2>

		<h3><span class="icon-member"></span>Starred Boards</h3>
        <board-list v-if="user.favorites?.length" @toggleFavorite="toggleFavorite" :boards="userFavoriteBoards"></board-list>
		<h2 v-else>No favorite boards yet...</h2>
		<h3><span class="icon-time"></span>Recent Boards</h3>
		<board-list @toggleFavorite="toggleFavorite" :boards="recentBoards"></board-list>

		<h3><span class="icon-members"></span>All boards in this Workspace</h3>
		<board-list @toggleFavorite="toggleFavorite" :boards="boards"></board-list>

    </section>
</template>
<script>
import workspaceFilter from '../components/workspace-filter.vue';
import boardList from '../components/board-list.vue';
import { boardService } from '../services/board-service.js';
import { userService } from '../services/user-service';

export default {
	name: 'workspace',
	async created() {
		await this.$store.dispatch({ type: 'loadBoards' })
	},
	methods: {
		async toggleFavorite(id) {
			const user = JSON.parse(JSON.stringify(this.user))
			if (!user.favorites) user.favorites = []
			const index = user.favorites.findIndex(favId => {
				console.log(favId)
				console.log(id)
				return favId === id
			})
			if (index === -1) user.favorites.push(id)
			else user.favorites.splice(index, 1)
			await this.$store.dispatch({ type: 'updateUser', user });

		}
	},
	computed: {
		user() {
			return this.$store.getters.user;
		},
		boards() {
			return this.$store.getters.boards
		},
		starredBoards() {
			return this.boards.filter(board => board.isFavorite)
		},
		otherBoards() {
			return this.boards.filter(board => !board.isFavorite)
		},
		recentBoards() {
			if (!this.boards.length) return [];
			return this.user.recentBoards.map(boardId => this.boards.find(board => board._id === boardId))
		},
		userFavoriteBoards() {
			if (!this.user.favorites) this.user.favorites = []
			let userFavBoards = this.user?.favorites.map(boardId => {
				const board = this.boards.filter(board => board._id === boardId)
				return board
			})

			return userFavBoards.flat()
		}
	},
	components: {
		workspaceFilter,
		boardList
	}
}
</script>
