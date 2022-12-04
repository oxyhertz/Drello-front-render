<template>
    <section class="invite-members-modal">
        <header>
            <p>Invite to board</p>
            <span @click="closeModal">
                <svg
                    width="10"
                    height="10"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.58579 7L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683418 0.292893 0.292893C0.683418 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L7 5.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893C14.0976 0.683418 14.0976 1.31658 13.7071 1.70711L8.41421 7L13.7071 12.2929C14.0976 12.6834 14.0976 13.3166 13.7071 13.7071C13.3166 14.0976 12.6834 14.0976 12.2929 13.7071L7 8.41421L1.70711 13.7071C1.31658 14.0976 0.683418 14.0976 0.292893 13.7071C-0.0976311 13.3166 -0.0976311 12.6834 0.292893 12.2929L5.58579 7Z"
                        fill="currentColor"
                    />
                </svg>
            </span>
        </header>
        <main>
            <input type="text" v-model="filterBy.name" placeholder="Member name" />
            <h4>Add Member</h4>
            <ul>
                <li v-for="(user, idx) in getRelevantUsers" :key="idx" @click="addMember(user)">
                    <avatar size="32" :name="user.fullname"></avatar>
                    <p>{{ user.fullname }}</p>
                </li>
            </ul>
        </main>
    </section>
</template>

<script>
export default {
    name: 'invite-members',
    props: {
        board: Object
    },
    data() {
        return {
            appUsers: null,
            filterBy: {
                name: ''
            }
        }
    },
    created() {
        this.appUsers = this.users;
    },
    methods: {
        closeModal() {
            this.$emit('closeInviteModal')
        },
        addMember({ fullname, _id, imgUrl }) {
            const newMember = {
                fullname,
                _id,
                imgUrl
            }

            let newBoard = JSON.parse(JSON.stringify(this.board))
            newBoard.members.push(newMember)
            this.$emit('addMember', newBoard.members);

        }
    },
    computed: {
        users() {
            return this.$store.getters.getAllUsers
        },
        getRelevantUsers() {
            let users = JSON.parse(JSON.stringify(this.appUsers));
            const regex = new RegExp(this.filterBy.name, 'i');
            users = users.filter(user => regex.test(user.fullname));
            return users.filter(user => {
                return !this.board.members.some(member => {
                    return user._id === member._id
                })
            })
        }
    }
}
</script>