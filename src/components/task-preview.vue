<template>
  <Draggable v-if="task">
    <div class="task-preview-container">
      <section
        class="task-preview"
        :style="taskStyle"
        @mouseover="editIcon = true"
        @mouseleave="editIcon = false"
        :class="{ 'on-quick-edit': isQuickEdit }"
        ref="tasky"
      >
        <span class="icon-edit" v-if="editIcon" @click.stop="quickEdit"></span>
        <div class="dark-wrap" v-if="this.task.cover?.imgUrl && this.task.cover.type === 'inline'"></div>
        <div class="task-preview-cover" :style="coverStyle" v-if="task.cover?.type === 'header'"></div>

        <div v-if="labels && this.task.cover?.type !== 'inline'" class="preview-icon labels">
          <div
            v-for="label, idx in labels"
            :key="idx"
            @click.stop="toggleLabels"
            class="label"
            :style="{ 'background-color': label.color }"
            :class="{ 'openLabel': labelStatus }"
            :title="label.title"
          >{{ label.title }}</div>
        </div>
        <p
          v-if="!isQuickEdit"
          class="title"
          :class="{ 'pos-absolute': this.task.cover?.type === 'inline' && this.task.cover?.imgUrl }"
        >{{ task.title }}</p>
        <textarea
          v-model="taskCopy.title"
          @change="updateTask(taskCopy)"
          v-if="isQuickEdit"
          name
          id
          cols="30"
          rows="10"
        ></textarea>
        <div class="icons">
          <div class="icon-container flex" v-if="this.task.cover?.type !== 'inline' && isIcons">
            <div
              v-if="task.dueDate"
              class="duedate"
              @click.stop="toggleStatus"
              :title="dueDateTitle"
            >
              <span
                class="preview-icon date"
                :style="{ 'font-size': 12 + 'px' }"
                :class="{ completed: task.status === 'completed', overdue: task.status === 'overdue' }"
              >
                <span class="clock-icon" v-if="task.status?.length"></span>
                <span class="icon-checklist" v-if="task?.status === 'completed'"></span>
                <span class="icon-emptyBox" v-if="task?.status === 'overdue'"></span>
                {{ date }}
              </span>
            </div>
            <div class="preview-icon" v-if="task.description" title="This card has a description.">
              <span class="icon-description"></span>
            </div>

            <div class="preview-icon" v-if="numOfComments" title="Comments">
              <span class="icon-chat"></span>
              <p>{{ numOfComments }}</p>
            </div>

            <div class="preview-icon" v-if="task.location" title="Location">
              <span class="icon-location"></span>
            </div>

            <div class="preview-icon" v-if="task.attachments?.length" title="Attachments">
              <span class="icon-attachment"></span>
              <p>{{ task.attachments?.length }}</p>
            </div>
            <div
              class="preview-icon"
              v-if="task.checklists?.length && numOfTodos"
              :class="{ completed: tasksDone === numOfTodos }"
              title="Checklist items"
            >
              <span class="icon-checklist"></span>
              <p>{{ tasksDone }} / {{ numOfTodos }}</p>
            </div>
          </div>
          <div class="preview-icon members" v-if="task.members?.length">
            <div v-for="member in task.members" :key="member._id" class="member">
              <avatar :size="28" color="white" :name="member.fullname"></avatar>
            </div>
          </div>
        </div>
        <!-- <button @click.stop="removeTask">Delete</button> -->
      </section>
      <quick-edit
        @removeTask="removeTask"
        @addItem="updateTask"
        :task="task"
        @openTask="openTask"
        :style="quickEditPos"
        v-if="isQuickEdit"
        :class="{ 'on-quick-edit': isQuickEdit }"
      ></quick-edit>
    </div>
    <div class="overlay" @click.stop="closeQuickEdit" :class="{ 'open-overlay': isQuickEdit }"></div>
  </Draggable>
</template>


<script>
import { Draggable } from 'vue3-smooth-dnd';
import moment from 'moment';
import quickEdit from './quick-edit.vue'

export default {
  name: 'task-preview',
  props: {
    task: {
      type: Object,
      required: true,
    },
    labelStatus: Boolean
  },
  data() {
    return {
      editIcon: false,
      isQuickEdit: false,
      taskCopy: null,
      displayLabels: false

    };
  },
  mounted() {
  },
  created() {
    this.taskCopy = JSON.parse(JSON.stringify(this.task))
  },
  components: {
    Draggable,
    quickEdit
  },
  methods: {
    toggleStatus() {
      var taskDup = JSON.parse(JSON.stringify(this.task))
      if (taskDup.status === '' || !taskDup.status) {
        taskDup.status = 'completed'
      }
      else if (taskDup.status === 'completed') {
        if (Date.now() > taskDup.dueDate) {
          taskDup.status = 'overdue'
        }
        else {
          taskDup.status = ''
        }
      }
      else if (taskDup.status === 'overdue') {
        taskDup.status = 'completed'
      }
      this.updateTask(taskDup)
    },
    toggleLabel() {
      this.$store.commit({ type: 'toggleLabel' })
    },
    removeTask() {
      this.$emit('removeTask', this.task._id)
      this.$emit('onQuickEdit', false)
    },
    toggleLabels() {
      this.$emit('toggleLabels');
    },
    quickEdit() {
      this.$emit('onQuickEdit', true)
      this.isQuickEdit = true;
    },
    closeQuickEdit() {
      this.$emit('onQuickEdit', false)
      this.isQuickEdit = false
    },
    updateTask(editedTask) {
      this.$emit('updateTask', JSON.parse(JSON.stringify(editedTask)))
    },
    openTask() {
      this.closeQuickEdit()
      this.$emit('openTask')
    },
    toggleLabels() {
      this.$emit('toggleLabels');
      if (this.displayLabels) this.displayLabels = !this.displayLabels;
      else
        setTimeout(() => {
          this.displayLabels = !this.displayLabels;
        }, 400);
    },
  },
  computed: {

    board() {
      return this.$store.getters.currBoard
    },
    labels() {
      if (!this.task.labelIds?.length) return false
      return this.task.labelIds.map(label => {
        return this.board.labels.find(currLabel => currLabel._id === label)
      })
    },
    date() {
      return moment(this.task.dueDate).format('lll').split(',')[0];
    },
    tasksDone() {
      const numOfDoneTodos = this.task.checklists.reduce((acc, { todos }) => {
        return acc + todos.reduce((acc, todo) => {
          return todo.isDone ? acc + 1 : acc;
        }, 0)
      }, 0)
      return numOfDoneTodos;
    },
    numOfTodos() {
      return this.task.checklists.reduce((acc, { todos }) => acc + todos.length, 0)
    },
    coverStyle() {
      if (this.task.cover?.color && !this.task.cover.imgUrl)
        return { 'background-color': this.task.cover.color };
      if (this.task.cover?.imgUrl) {
        return { 'background-image': 'url(' + this.task.cover.imgUrl + ')', 'height': '260px' }
      }
    },
    taskStyle() {
      if (this.task.cover?.type === 'inline') {
        const style = {
          'background-color': this.task.cover.color,
          'font-weight': 500,
          'font-size': '16px',
          'padding-top': '30px',
          'background-image': 'url(' + this.task.cover.imgUrl + ')',
          'min-height': this.task.cover.imgUrl ? '250px' : '',
          'color': '#fff',
          'padding-top': this.task.cover.imgUrl ? '215px' : '30px',
        }
        return style
      }
    },
    numOfComments() {
      if (!this.task.activities?.length) return 0;
      return this.task.activities.reduce((acc, activity) => activity.isComment ? acc + 1 : acc, 0);
    },
    quickEditPos() {
      const top = this.$refs.tasky.getBoundingClientRect().y;
      const right = this.$refs.tasky.getBoundingClientRect().right;

      return { top: top + 'px', left: right + 'px' }
    },
    isIcons() {
      return this.task.dueDate || this.task.location || this.task.description || this.numOfComments || this.task.attachments?.length || (this.task.checklists?.length && this.numOfTodos)
    },
    dueDateTitle() {
      let status;
      if (!this.task.status) status = 'due later.'
      else status = (this.task.status === 'completed') ? 'complete.' : 'overdue!';

      return `This card is ${status}`;
    }
  }
};
</script>