<template>
	<section class="board-header-title">
		<input
			type="text"
			:size="inputSize"
			v-model="titleToEdit"
			class="inline-input"
			:class="{ editable: isEditAble }"
			:disabled="!isEditAble"
			@blur="editTitle"
		/>
	</section>
</template>

<script>
export default {
	name: 'board-header-title',
	props: {
		board: Object,
		createdBy: String
	},
	data() {
		return {
			titleToEdit: ''
		}
	},
	created() {
		this.titleToEdit = this.boardTitle
	},
	watch: {
		'$route.params.boardId': {
			async handler(newId, oldId) {
				this.titleToEdit = this.$store.getters.currBoard.title;
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		editTitle() {
			if (!this.titleToEdit) return this.titleToEdit = this.boardTitle;
			if (!this.isEditAble) return;
			this.$emit('editTitle', this.titleToEdit);
		}
	},
	computed: {
		userId() {
			return this.$store.getters.miniUser?._id;
		},
		isEditAble() {
			return this.createdBy === this.userId;
		},
		inputSize() {
			const MAX_SIZE = 60;
			const MIN_SIZE = 1;
			const size = this.titleToEdit.length - 2;

			if (size < MIN_SIZE) return MIN_SIZE;
			else if (size > MAX_SIZE) return MAX_SIZE;
			return size;
		},
		boardTitle() {
			return this.board?.title;
		}
	}
}
</script>
