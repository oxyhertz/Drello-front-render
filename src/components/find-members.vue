<template >
    <section v-if="board" class="members-item">
        <h3 class="header">Mentions...</h3>
        <ul>
            <li
                v-for="member in board.members"
                :key="member._id"
                class="member find flex align-items space-between"
                @click.stop="addMember(member)"
            >
                <div class="member-container flex align-items justify-center">
                    <div class="avatar">
                        <avatar :size="28" color="white" :name="member.fullname"></avatar>
                    </div>
                    <span class="name">{{ member.fullname }}</span>
                </div>
            </li>
        </ul>
    </section>
</template>

<script>
export default {
    props: ['board'],
    data() {
        return {

        }
    },
    methods: {
        addMember({ fullname, username, imgUrl, _id }) {
            const member = {
                fullname,
                username,
                imgUrl,
                _id,
            }
            this.$emit('addTag', member);
        },
        computed: {
            currTask() {
                return this.$store.getters.currTask
            },
            currTaskMembersIds() {
                let members = this.currTask.members
                if (members) {
                    return members.map(member => member._id)
                } else return []
            }
        },
    },
}
</script>
