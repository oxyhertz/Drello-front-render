<template>
  <section class="task-combo-list flex wrap">
    <section v-if="members?.length" class="members flex column">
      <h3>Members</h3>
      <section class="flex">
        <div v-for="member in members" :key="member._id">
          <avatar size="32" color="white" :name="member.fullname" class="avatar"></avatar>
        </div>
        <span @click="setMembers" class="combo-add-icon"></span>
      </section>
    </section>
    <section v-if="taskLabels?.length" class="labels flex column">
      <h3>Labels</h3>
      <section class="flex label">
        <div v-for="(label, idx) in taskLabels" :key="idx">
          <span v-if="label" :style="{ 'background-color': label.color }">
            {{
              label.title
            }}
          </span>
        </div>
        <div class="combo-add-icon label" @click="setLabels"></div>
      </section>
    </section>
    <section v-if="dueDate" class="due-date">
      <h3>Due date</h3>
      <section class="due-date flex">
        <input type="checkbox" class="date-checkbox" v-model="dateStatus" @change="updateStatus" />
        <div class="title" @click="setDate">
          {{ date }}
          <span
            class="status"
            :class="{ completed: status === 'completed', overdue: status === 'overdue' }"
          >{{ status }}</span>
          <span class="open-icon"></span>
        </div>
      </section>
    </section>
  </section>
</template>
<script>
import moment from 'moment';
export default {
  props: {
    task: Object
  },
  data() {
    return {
      dateStatus: false,
    };
  },
  created() {
    if (this.status === 'completed') this.dateStatus = true
  },
  methods: {
    updateStatus() {
      var status = ''
      if (this.dateStatus) status = 'completed';
      else if (this.dueDate < Date.now()) status = 'overdue'
      const item = {
        type: 'status',
        item: status
      }
      this.$emit('addItem', item)
    },
    setLabels() {
      this.$emit('setLabels');
    },
    setDate() {
      this.$emit('setDate');
      this.updateStatus()
    },
    setMembers() {
      this.$emit('setMembers');
    },
  },
  computed: {
    status() {
      if (this.currStatus === 'completed') return 'completed';
      else if (this.dueDate < Date.now()) return 'overdue';
    },
    currStatus() {
      return this.task.status;
    },
    dueDate() {
      return this.task.dueDate;
    },
    members() {
      return this.task.members;
    },
    labelIds() {
      return this.task.labelIds;
    },
    boardLabels() {
      return this.$store.getters.currBoard.labels;
    },
    taskLabels() {
      if (!this.labelIds?.length) return;
      return this.labelIds.map((lableId) => {
        return this.boardLabels.find(
          (boardLable) => boardLable._id === lableId
        );
      });
    },
    date() {
      return moment(this.dueDate).format('lll');
    },
  },
  watch: {
    'dueDate'() {
      this.updateStatus()
    },
  }

};
</script>