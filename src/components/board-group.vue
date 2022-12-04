<template>
  <Container
    group-name="cols"
    tag="div"
    orientation="horizontal"
    drag-handle-selector=".group-title"
    non-drag-area-selector=".group-edit-popup"
    drag-class="dragging"
    drop-class="dropping"
    :animation-duration="0"
    @drop="onGroupDrop($event)"
    @touchend="enableMobileScrolling"
  >
    <Draggable class v-for="(group, idx) in scene.groups" :key="group._id">
      <section class="group-container">
        <section class="group-title">
          <textarea
            :value="group.title"
            @blur="editGroupTitle($event, group, idx)"
            @keydown.enter="editGroupTitle($event, group, idx)"
            spellcheck="false"
            class="group-title inline-input"
          ></textarea>
          <span class="menu-icon" @click="toggleGroupEdit(idx, true)"></span>
          <group-edit-popup
            v-if="isGroupEdit[idx]"
            class="popup"
            @closePopup="toggleGroupEdit(idx)"
            @removeGroup="removeGroup"
            v-click-outside="toggleGroupEdit"
            :group="group"
          />
        </section>

        <Container
          orientation="vertical"
          group-name="col-items"
          non-drag-area-selector=".on-quick-edit"
          :get-child-payload="getCardPayload(group._id)"
          :drop-placeholder="{
            className: `drag-placeholder-task`
          }"
          drag-class="dragging"
          drop-class="dropping"
          :animation-duration="0"
          @drop="(e) => onTaskDrop(group._id, e)"
          @touchend="enableMobileScrolling"
        >
          <!-- tasks -->
          <task-preview
            v-for="task in group.tasks"
            @updateTask="updateTask"
            @openTask="openTask(board, group, task)"
            @onQuickEdit="onQuickEdit"
            @removeTask="removeTask($event, group._id)"
            @click.stop="openTask(board, group, task)"
            @toggleLabels="toggleLabels"
            :key="task._id"
            :task="task"
            :labelStatus="isLabelsOpen"
          />
        </Container>
        <task-add @addTask="addTask($event, group._id)" />
      </section>
    </Draggable>
    <add-group @add="addGroup" />
  </Container>

  <div class="overlay" :class="{ 'open-overlay': isTaskDetail }">
    <task-details-modal
      @cleanStore="cleanStore"
      v-click-outside="closeModal"
      @closeModal="closeModal"
      v-if="isTaskDetail"
      @editTask="editTask"
    />
  </div>
</template>

<script>
import { Container, Draggable } from 'vue3-smooth-dnd';
import taskPreview from './task-preview.vue';
import taskAdd from './task-add.vue';
import addGroup from '../components/add-group.vue';
import taskDetailsModal from '../components/task-details-modal.vue';
import groupEditPopup from '../components/group-edit-popup.vue';

export default {
  name: 'board-group',
  emits: ['columnChange', 'addGroup', 'removeTask', 'addTask', 'taskChange', 'editTask', 'cleanStore', 'editGroup', 'removeGroup'],
  props: {
    groups: {
      type: Array,
      required: true,
    },
    board: Object
  },
  data() {
    return {
      scene: { groups: this.groups },
      isTaskDetail: false,
      isLabelsOpen: false,
      isQuickEdit: false,
      isGroupEdit: [],
    };
  },
  components: {
    Container,
    Draggable,
    taskPreview,
    taskAdd,
    addGroup,
    taskDetailsModal,
    groupEditPopup
  },
  watch: {
    groups(newGroup, oldGroup) {
      this.scene = {
        groups: newGroup
      }
    }
  },
  methods: {
    cleanStore() {
      this.$emit('cleanStore', ['Task', 'Group']);
    },
    openTask(board, group, task) {
      if (this.isQuickEdit) return
      this.isTaskDetail = true;
      this.$store.commit({ type: 'setCurrGroup', group })
      this.$store.commit({ type: 'setCurrTask', task })
    },
    addGroup(title) {
      this.$emit('addGroup', title);
    },
    editGroupTitle($event, group, idx) {
      $event.target.blur(); // needed when pressing enter
      const newTitle = $event.target.value;
      if (!newTitle) return $event.target.value = group.title;
      const groupToSave = JSON.parse(JSON.stringify(group));
      groupToSave.title = newTitle;
      this.$emit('editGroup', { groupIdx: idx, newGroup: groupToSave });
    },
    toggleGroupEdit(idx, state = false) {
      if (typeof idx === 'object' || state) {
        this.isGroupEdit.forEach((groupState, groupIdx) => this.isGroupEdit[groupIdx] = false)
      }
      this.isGroupEdit[idx] = state;
    },
    removeGroup(groupId) {
      this.$emit('removeGroup', groupId);
    },
    removeTask(taskId, groupId) {
      const task = {
        taskId,
        groupId,
      };
      this.$emit('removeTask', task);
    },
    addTask(title, groupId) {
      const task = {
        title,
        groupId,
        members: []
      };
      this.$emit('addTask', task);
    },
    editTask(editedTask) {
      this.$emit('editTask', editedTask);
    },
    closeModal() {
      this.isTaskDetail = false
    },
    toggleLabels() {
      this.isLabelsOpen = !this.isLabelsOpen;
    },
    applyDrag(arr, dragResult) {
      const { removedIndex, addedIndex, payload } = dragResult;
      if (removedIndex === null && addedIndex === null) return arr;
      const result = [...arr];
      let itemToAdd = payload;
      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0];
      }
      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
      }
      return result;
    },
    onGroupDrop(dropResult) {
      const scene = Object.assign({}, this.scene);
      scene.groups = this.applyDrag(scene.groups, dropResult);
      this.scene = scene;
      this.$emit('columnChange', this.scene.groups);
    },
    onTaskDrop(groupId, dropResult) {
      // check if element where ADDED or REMOVED in current collumn
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        const scene = Object.assign({}, this.scene);
        const group = scene.groups.filter((p) => p._id === groupId)[0];
        const groupIdx = scene.groups.indexOf(group);
        const newGroup = Object.assign({}, group);

        newGroup.tasks = this.applyDrag(newGroup.tasks, dropResult);
        this.$emit('taskChange', { groupIdx, newGroup })
      }
    },
    getCardPayload(groupId) {
      return (index) => {
        return this.scene.groups.filter((p) => p._id === groupId)[0].tasks[
          index
        ];
      };
    },
    onQuickEdit(state) {
      this.isQuickEdit = state;
    },
    updateTask(task) {
      const taskGroup = this.groups.filter(group => {
        group.tasks.some(groupTask => groupTask._id === task._id)
        return group._id
      })
      this.$emit('editTask', task)
    },
    enableMobileScrolling() {
      document.body.classList.remove('smooth-dnd-no-user-select', 'smooth-dnd-disable-touch-action');
    }
  },
};
</script>

<!-- <style>
/** NB: dont remove, 
* When using orientation='horizontal' it auto sets 'display: table'
* In this case we need flex and not display table  
*/
.smooth-dnd-container.horizontal {
  display: flex !important;
}
</style> -->

