<template>
	<section v-if="currBoard" class="board-container">
		<board-header
			@setBg="setBg"
			:board="currBoard"
			@editTitle="editBoardTitle"
			@addMember="addMember"
			@toggleFavorite="toggleFavorite"
			@setFilter="setFilter"
			:filterBy="filterBy"
		/>
		<section class="group-container-scrollable">
			<board-group
				@removeTask="removeTask"
				@addTask="setTask"
				@editTask="editTask"
				@taskChange="taskChange"
				@columnChange="columnChange"
				@addGroup="addGroup"
				@editGroup="editGroup"
				@removeGroup="removeGroup"
				@cleanStore="cleanStore"
				:groups="groupsToDisplay"
				:board="currBoard"
			/>
		</section>

		<!-- <img ref="targetImg" id="target-img" :src="currBoard.style.bgImg" @load="getPalette()" /> -->
	</section>
</template>

<script>
import { nextTick } from 'vue'
import boardGroup from '../components/board-group.vue';
import { socketService } from '../services/socket-service.js';
import { boardService } from '../services/board-service';
import boardHeader from '../components/board-header.vue'
import Vibrant from "node-vibrant"

export default {
	name: 'board-details',
	components: {
		boardGroup,
		boardHeader
	},
	data() {
		return {
			// board: null,
			filterBy: {
				title: '',
				labels: [],
				members: [],
				dueDate: [],
			},
			palette: {},
		};
	},

	watch: {
		'$route.params.boardId': {
			immediate: true,
			async handler(newId, oldId) {
				await this.$store.dispatch({
					type: 'setCurrentBoard',
					boardId: newId,
				});
				// this.board = this.currBoard;
			},
			deep: true,
		}
	},
	async created() {
		await this.loadBoard()
		if (!this.boards || !this.boards.length) {
			await this.$store.dispatch({ type: 'loadBoards' })
		}
		// this.board = this.currBoard;
		// const { boardId } = this.$route.params;
		// socketService.emit("board topic", boardId);

		// socketService.on('board update', this.loadBoard())
	},

	unmounted() {
		this.$store.commit({ type: 'setCurrentBoard', board: null })
	},
	methods: {
		getPalette() {
			const img = this.$refs.targetImg
			const vibrant = new Vibrant(img);

			img.setAttribute('crossOrigin', 'anonymous')
			vibrant.getPalette().then(
				(palette) => this.palette = palette,
				(reason) => {
					console.error(reason);
				}
			)
		},
		async loadBoard() {
			try {
				const boardId = this.$route.params.boardId;
				await this.$store.dispatch({
					type: 'setCurrentBoard',
					boardId,
				});
				this.$store.commit({ type: 'addRecentBoard', boardId })
				this.board = null;
				await nextTick();
			} catch (err) {
				console.log('err', err)
			}
		},
		removeTask(task) {
			this.$store.dispatch({
				type: 'removeTask',
				task,
			});
		},
		setTask({ title, groupId }) {
			var task = { title };
			this.$store.dispatch({ type: 'setTask', groupId, task, });
		},
		editTask(editedTask) {
			this.$store.dispatch({ type: 'setTask', task: editedTask });
		},
		quickUpdateTask() {
			this.$store.dispatch({ type: 'setTask', task: editedTask });
		},
		addGroup(groupTitle) {
			this.$store.dispatch({ type: 'addGroup', groupTitle })
		},
		editGroup({ groupIdx, newGroup }) {
			this.$store.dispatch({ type: 'setGroup', groupIdx, newGroup })
		},
		removeGroup(groupId) {
			this.$store.dispatch({ type: 'removeGroup', groupId })
		},
		columnChange(boardGroups) {
			this.$store.dispatch({ type: 'setGroups', groups: boardGroups });
		},
		taskChange({ groupIdx, newGroup }) {
			this.$store.dispatch({ type: 'setGroup', groupIdx, newGroup });
		},
		editBoardTitle(newTitle) {
			this.$store.dispatch({ type: 'setBoardPrefs', key: 'title', val: newTitle });
		},
		async toggleFavorite(isFavorite) {
			const user = JSON.parse(JSON.stringify(this.user))
			if (!user.favorites) user.favorites = []
			const index = user.favorites.findIndex(favId => {
				return favId === this.currBoard._id
			})
			if (isFavorite) {
				user.favorites.push(this.currBoard._id)
			} else {
				user.favorites.splice(index, 1)
			}
			await this.$store.dispatch({ type: 'updateUser', user });
		},
		cleanStore(itemsToClean) {
			itemsToClean.forEach(item => {
				const toCommit = {
					type: `setCurr${item}`
				}
				toCommit[item.toLowerCase()] = null;
				this.$store.commit(toCommit)
			})
		},
		async addMember(members) {
			await this.$store.dispatch({ type: 'setBoardPrefs', key: 'members', val: members });
			// this.board = this.currBoard
		},
		async setBg(bg) {
			const board = JSON.parse(JSON.stringify(this.currBoard))
			board.style[bg.type] = bg.val
			if (bg.type === 'bgColor') board.style.bgImg = ''
			await this.$store.dispatch({ type: 'saveBoard', board: board })
			await this.$store.dispatch({
				type: 'setCurrentBoard',
				boardId: board._id,
			});
		},
		setFilter(filterBy) {
			const copyfilter = JSON.parse(JSON.stringify(filterBy))
			this.filterBy = copyfilter;
		},
	},
	computed: {
		accent() {
			if (!this.palette) {
				console.log('this.palette', this.palette)
				return `crismon`;
			}
			return this.palette.Vibrant.getHex()
		},
		user() {
			return this.$store.getters.user;
		},
		miniUser() {
			return this.$store.getters.miniUser;
		},
		groups() {
			return this.$store.getters.boardGroups;
		},
		currBoard() {
			return this.$store.getters.currBoard;
		},
		boards() {
			return this.$store.getters.boards;
		},
		groupsToDisplay() {
			let filteredGroups = [];
			const board = JSON.parse(JSON.stringify(this.currBoard))
			const regex = new RegExp(this.filterBy.title, 'i')
			filteredGroups = board.groups.filter((group) => regex.test(group.title) || group.tasks.some(task => regex.test(task.title)))
			if (this.filterBy.members.length) {
				filteredGroups = filteredGroups.filter(group => {
					return group.tasks.some(task => {
						return task.members?.some(member => {
							return this.filterBy.members.includes(member._id)
						})
					})
				})
				filteredGroups = filteredGroups.map(group => {
					group.tasks = group.tasks.filter(task => {
						if (!task.members) task.members = []
						return task.members?.some(member => this.filterBy.members.includes(member._id))
					})
					return group
				})
			}

			if (this.filterBy.labels.length) {
				filteredGroups = filteredGroups.filter(group => {
					return group.tasks.some(task => {
						return task.labelIds?.some(label => {
							return this.filterBy.labels.includes(label)
						})
					})
				})
				filteredGroups = filteredGroups.map(group => {
					group.tasks = group.tasks.filter(task => {
						if (this.filterBy.labels.includes('none')) {

						}
						return task.labelIds?.some(label => {
							if (label === 'none') return
							return this.filterBy.labels.includes(label)
						})
					})
					return group
				})
			}

			if (this.filterBy.dueDate) {
				if (this.filterBy.dueDate === 'overdue') {
					filteredGroups = filteredGroups.filter(group => {
						return group.tasks.some(task => task.status === 'overdue')
					})
				}
			}
			return filteredGroups
		}
	}
}
</script>


<style>
.toast {
	width: 20%;
	height: 70px;
	background-color: #0079bf;
}
</style>