<template >
    <section class="board-filter">
        <header>
            <span class="icon-back header-icon" @click="goBack"></span>
            <h3>Filter</h3>
            <span class="icon-cancel header-icon" @click="closeFilter"></span>
        </header>
        <div class="search-inp">
            <h4>Keyword</h4>
            <input
                v-focus
                type="text"
                v-model="filterBy.title"
                placeholder="Enter a keyword..."
                @input="setFilter"
            />
            <p>Search cards, members, labels, and more.</p>
        </div>
        <div class="members">
            <h4>Members</h4>
            <ul>
                <li v-for="(member, idx) in board.members" :key="member._id">
                    <input
                        :value="member._id"
                        v-model="filterBy.members"
                        @change="setFilter"
                        type="checkbox"
                        :id="member._id"
                    />
                    <avatar size="24" :name="member.fullname"></avatar>
                    <p>{{ member.fullname }}</p>
                </li>
            </ul>
        </div>
        <div class="dates">
            <h4>Due date</h4>
            <ul>
                <li v-for="option in dueDateOptions" :key="option._id">
                    <label>
                        <input
                            @change="setFilter"
                            v-model="filterBy.dueDate"
                            type="checkbox"
                            :value="option.val"
                        />
                        <span :class="option.classList"></span>
                        <p>{{ option.txt }}</p>
                    </label>
                </li>
            </ul>
        </div>
        <div class="labels">
            <h4>Labels</h4>
            <ul>
                <li>
                    <label>
                        <input
                            @change="setFilter"
                            type="checkbox"
                            v-model="filterBy.labels"
                            value="none"
                        />
                        <span class="icon-label"></span>
                        <p>No labels</p>
                    </label>
                </li>
                <li v-for="label in board.labels">
                    <label>
                        <input
                            :value="label._id"
                            v-model="filterBy.labels"
                            @change="setFilter"
                            type="checkbox"
                            :id="label._id"
                        />
                        <div class="label" :style="{ 'background-color': label.color }">
                            <p>{{ label.title }}</p>
                        </div>
                    </label>
                </li>
            </ul>
        </div>
    </section>
</template>
<script>
export default {
    name: 'close-filter',
    props: {
        board: Object,
        filter: Object
    },
    data() {
        return {
            dueDateOptions: [
                { _id: '1', txt: 'No dates', classList: 'icon-date', val: 'no-dates' },
                { _id: '2', txt: 'Overdue', classList: 'icon-time red-bg', val: 'overdue' },
                { _id: '3', txt: 'Due in the next day', classList: 'icon-time wait-bg', val: 'next-day' },
            ],
            filterBy: {
                title: '',
                labels: [],
                members: [],
                dueDate: []
            }
        }
    },
    created() {
        this.filterBy = this.filter
    },
    methods: {
        closeFilter() {
            this.$emit('closeFilter')
        },
        setFilter() {
            console.log(this.filter)
            this.$emit('setFilter', { ...this.filterBy })
        },
    },

    components: {
    }
}
</script>