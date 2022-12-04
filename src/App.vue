<template>
	<div ref="wrapper" class="wrapper" :style="boardStlye">
		<app-header v-if="!isHomePage" />
		<router-view />
	</div>
</template>

<script>
import appHeader from './components/main-header.vue'
import { socketService } from './services/socket-service';
import { userService } from './services/user-service.js';
import { boardService } from './services/board-service.js';
import { ElNotification } from 'element-plus'


export default {
	name: 'app',
	async created() {
		// await this.$store.dispatch({ type: 'loadBoards' })
		socketService.off('notify activity')
		socketService.on('notify activity', this.notifyActivity)
		socketService.off('mention user')
		socketService.on('mention user', this.notifyActivity)
		try {
			await this.$store.dispatch({ type: 'loadUsers' })
			if (this.miniUser) socketService.emit('set-user-socket', this.miniUser._id)
		} catch (err) {
			console.log(err)
		}
	},
	methods: {
		getBoardById(id) {
			return this.boards.find(board => board._id === id)
		},
		getMemberById(id) {
			return this.users.find(user => user._id === id)
		},
		notify(isPrivate = null, title, message) {
			if (isPrivate) {
				ElNotification({
					title,
					message,
					dangerouslyUseHTMLString: true,
					type: 'success',
					duration: 2000
				})
			} else ElNotification({
				title,
				message,
				dangerouslyUseHTMLString: true,
				type: 'info',
				duration: 2000
			})
		},
		async notifyActivity(activity) {
			console.log('activity', activity)
			// let toMember = ''
			// const itemName = activity.item?.taskTitle || activity.item?.taskGroup
			let title
			let message
			const byMember = this.getMemberById(activity.byMemberId)
			let board = this.getBoardById(activity.boardId)
			if (!board) board = await boardService.getBoardById(activity.boardId)
			if (activity.toMemberId) {
				if (!activity.groupId) {
					title = "You've been added to a new board !"
					message = byMember.fullname + ` just added you to a new board ` + `<a class="notification-link" href=https://drello-app.herokuapp.com/#/board/${activity.boardId}> ${board.title} </a>`
				} else {
					if (activity.isMention) {
						title = "You've been mentioned"
						message = byMember.fullname + ' just menitoned you on a task at' + `<a class="notification-link" href=https://drello-app.herokuapp.com/#/board/${activity.boardId}> board ${board.title} </a>`
					} else {
						title = "You've been added to a new task !"
						message = byMember.fullname + ' just added you to a task at' + `<a class="notification-link" href=https://drello-app.herokuapp.com/#/board/${activity.boardId}> board ${board.title} </a>`
					}
				}
				if (userService.getLoggedinUser()._id === activity.toMemberId) {
					this.notify(true, title, message)
					this.$store.commit({ type: 'updateActivities', activity })
				}
			} else if (activity.byMemberId !== this.miniUser._id && board.members.find(member => member._id === this.miniUser._id)) {
				title = activity.txt
				message = byMember.fullname + ' just ' + title + ' to ' + `<a class="notification-link" href=https://drello-app.herokuapp.com/#/board/${activity.boardId}> board ${board.title} </a>`
				this.notify(null, title, message)
				this.$store.commit({ type: 'updateActivities', activity })
			}
		},

	},
	mounted() {
		console.log(this.$refs.wrapper)
	},
	computed: {
		boards() {
			return this.$store.getters.boards;
		},
		users() {
			return this.$store.getters.getAllUsers;
		},
		miniUser() {
			return this.$store.getters.miniUser;
		},
		currBoardStyle() {
			return this.$store.getters.currBoard?.style?.bgColor
		},
		currBoard() {
			return this.$store.getters.currBoard?.style
		},
		boardStlye() {
			return { 'background-color': this.currBoard?.bgColor, 'background-image': 'url(' + this.currBoard?.bgImg + ')' }
		},
		isHomePage() {
			return this.$store.getters.isHomePage
		},
	},
	components: {
		appHeader,
	},
}

</script>

