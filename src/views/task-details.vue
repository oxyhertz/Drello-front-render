<template v-if="task">
	<h1>{{ task.title }}</h1>
</template>

<script>
export default {
	data() {
		return {
			board: '',
			task: null,
		};
	},
	created() {
		var currGroup = this.groups.find(group => group._id === this.$route.params.groupId)
		this.task = currGroup.tasks.find(task => task._id === this.$route.params.taskId)
	},
	computed: {
		groups() {
			return this.$store.getters.boardGroups;
		},
	},
};
</script>

<style>
</style>