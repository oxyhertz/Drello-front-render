<template >
    <section class="user-notification" v-if="users.length && boards.length">
        <header>
            <p>Notification</p>
            <span class="icon-cancel" @click="$emit('closeModal')"></span>
        </header>
        <div class="activity-actions">
            <span v-if="filterBy.isReaden" @click="filterBy.isReaden = false">View All</span>
            <span v-else @click="filterBy.isReaden = true">Filter by unread</span>
            <span
                @click="toggleAllActivities"
                v-if="activities.some(activity => activity.isReaden === false)"
            >Mark all as read</span>
        </div>
        <div v-if="!activitiesToDisplay.length" class="empty-notifications">
            <img src="../images/dog-sleep.svg" alt />
            <h2>No unread notifications</h2>
            <p>Click View all to view all of your notifications</p>
        </div>
        <ul v-if="activities">
            <li
                v-for="(activity, idx) in  activitiesToDisplay"
                :key="idx"
                :class="{ 'white-bg': activity.isReaden }"
            >
                <button
                    @click="toggleReaden(activity._id)"
                    :class="{ 'light-btn': activity.isReaden }"
                ></button>
                <div class="notification-content">
                    <header
                        :style="{ 'background-color': getBoard(activity.boardId).style.bgColor, 'background-image': 'url(' + getBoard(activity.boardId).style.bgImg + ')' }"
                    >
                        <div>
                            <h4 v-if="activity.groupId === null">Board Invitaion</h4>
                            <h4 v-if="activity.toMemberId && activity.groupId">Task Mention</h4>
                            <h4 v-if="!activity.toMemberId">Task Added</h4>
                        </div>
                    </header>
                    <main>
                        <!-- {{ activity }} -->
                        <div class="user flex">
                            <avatar size="24" :name="getUser(activity.byMemberId)"></avatar>
                            <span>{{ getUser(activity.byMemberId) }}</span>
                        </div>
                        <div class="activity">
                            <div class="icon">
                                <span class="icon-add-member"></span>
                            </div>
                            <div>
                                <p v-if="activity.groupId === null">
                                    {{ getUser(activity.byMemberId) }} invited you to board
                                    <router-link
                                        :to="`/board/${activity.boardId}`"
                                    >{{ activity.txt }}</router-link>
                                </p>
                                <p v-if="activity.toMemberId && activity.groupId">
                                    {{ getUser(activity.byMemberId) }} added you to
                                    <router-link :to="`/board/${activity.boardId}`">task</router-link>
                                </p>
                                <p v-if="!activity.toMemberId">
                                    {{ getUser(activity.byMemberId) }} added a task in board
                                    <router-link
                                        :to="`/board/${activity.boardId}`"
                                    >{{ activity.txt }}</router-link>
                                </p>
                                <div>
                                    <timeago class="time" :datetime="activity.createdAt" />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </li>
        </ul>
    </section>
</template>
<script>
import { userService } from '../services/user-service.js'
export default {
    name: 'notify-user',

    data() {
        return {
            filterBy: {
                isReaden: true,
            }
        }
    },
    async created() {

    },
    methods: {
        async toggleReaden(activityId) {
            await this.$store.dispatch({ type: 'toggleActivity', activityId })
        },
        getUser(id) {
            console.log(this.users)
            const member = this.users.find(user => user._id === id)
            return member.fullname;
        },
        getBoard(id) {
            const currBoard = this.boards.find(board => board._id === id)
            return currBoard
        },
        async toggleAllActivities() {
            await this.$store.dispatch({ type: 'toggleAllActivities' })

        }


    },
    computed: {
        activities() {
            return this.$store.getters.user?.activities
        },
        isReaden() {
            return this.$store.getters.user?.activities.some(activity => !activity.isReaden)
        },
        users() {
            return this.$store.getters.getAllUsers
        },
        boards() {
            return this.$store.getters.boards
        },
        activitiesToDisplay() {
            if (this.filterBy.isReaden) {
                return this.activities.filter(activity => !activity.isReaden)
            }
            return this.activities
        }
    }


}
</script>

<style>
.green-bg {
    background-color: green;
}
</style>