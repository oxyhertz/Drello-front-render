<template>
    <section class="members-preview">
        <div class="avatar-container" v-for="member in board.members" :key="member._id">
            <avatar :size="28" color="white" :name="member.fullname"></avatar>
            <img
                class="admin-badge"
                v-if="board.createdBy._id === member._id"
                src="https://a.trellocdn.com/prgb/dist/images/chevron.88a4454280d68a816b89.png"
            />
        </div>
    </section>
</template>

<script>
export default {
    name: 'members-preview',
    props: {
        board: Object,
    },
    components: {
        // Avatar,
    },
}
</script>