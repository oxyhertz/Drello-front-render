<template >
  <section v-if="board" class="members-item">
    <input type="text" placeholder="Search members" @input="findMembers" v-model="filterBy.name" />
    <h3>Board members</h3>
    <ul>
      <li
        v-for="member in getRelevantUsers"
        :key="member._id"
        class="member flex align-items space-between"
        @click.stop="addMember(member)"
      >
        <div class="member-container flex align-items justify-center">
          <div class="avatar">
            <avatar :size="32" color="white" :name="member.fullname"></avatar>
          </div>
          <span class="name">{{ member.fullname }}</span>
        </div>
        <span class="icon-complete" v-if="currTaskMembersIds.includes(member._id)"></span>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    board: Object,
    task: Object,
  },
  data() {
    return {
      filterBy: {
        name: ''
      }
    }
  },
  methods: {
    addMember({ fullname, username, imgUrl, _id }) {
      const member = {
        type: 'members',
        item: {
          fullname,
          username,
          imgUrl,
          _id,
        }
      }
      this.$emit('addItem', member);
    },
  },
  computed: {
    getRelevantUsers() {
      let users = JSON.parse(JSON.stringify(this.boardMembers));
      const regex = new RegExp(this.filterBy.name, 'i');
      return users.filter(user => regex.test(user.fullname));
    },
    boardMembers() {
      return this.board.members
    },
    currTask() {
      // if (this.$store.getters.currTask) return this.$store.getters.currTask
      return this.task

    },
    currTaskMembersIds() {
      let members = this.currTask?.members
      // if (!members) members = []
      if (members) {
        return members.map(member => member._id)
      } else return []
    }
  }
};
</script>
