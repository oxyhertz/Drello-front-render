<template>
  <section class="task-details-modal">
    <div v-if="taskToEdit.cover" :style="coverStyle" class="task-cover">
      <span class="icon-cancel" @click="closeModal"></span>
    </div>
    <div class="header">
      <span class="icon-cancel" v-if="!taskToEdit.cover" @click="closeModal"></span>
      <span class="icon title-icon"></span>
      <input type="text" @blur="onTaskEdit" v-model="taskToEdit.title" class="task-details-title" />
    </div>
    <p class="boad-title">In list {{ board.title }}</p>
    <section class="task-detail-main">
      <div class="task-content">
        <task-combo-list
          v-if="taskToEdit.members || taskToEdit.labelIds || taskToEdit.dueDate"
          :task="taskToEdit"
          @setLabels="setLabels('labelsItem')"
          @setDate="setDate('dateItem')"
          @setMembers="setMembers('membersItem')"
          @addItem="addItem"
        />
        <div class="task-description">
          <div class="block-title">
            <span class="icon"></span>
            <h3>Description</h3>
          </div>
          <div v-click-outside="saveDescEdit" class="description-container">
            <contenteditable
              @click="isDescEditMode = true"
              tag="div"
              contenteditable="true"
              spellcheck="false"
              v-model="taskToEdit.description"
              :noHTML="true"
              class="description-textarea"
              :class="{ 'desc-with-content': taskToEdit.description, 'focused': isDescEditMode }"
            />
            <div v-if="isDescEditMode" class="save-close-description">
              <button class="save" @click="saveDescEdit">Save</button>
              <i class="fa-solid fa-x" @click="cancelDescEdit"></i>
            </div>
          </div>
        </div>
        <div v-if="taskToEdit.attachments?.length" class="attachment-container">
          <div class="block-title">
            <span class="icon"></span>
            <h3>Attachments</h3>
          </div>
          <div class="attachment-content">
            <attachment :attachments="taskToEdit.attachments" @updateAttachments="updateItem" />
          </div>
        </div>

        <div v-if="task.location" class="task-location">
          <div class="block-title">
            <span class="icon"></span>
            <h3>Location</h3>
          </div>
        </div>
        <div v-if="task.location" class="location-container">
          <GMapMap
            class="maps"
            :center="task.location"
            :zoom="7"
            map-type-id="terrain"
            style="width: 500px; height: 300px"
          >
            <GMapCluster>
              <GMapMarker :position="task.location" />
            </GMapCluster>
          </GMapMap>
          <a @click="deleteMap">Delete</a>
        </div>

        <task-check-list
          v-for="checklist in taskToEdit.checklists"
          :key="checklist._id"
          :checklist="checklist"
          @updateItem="updateItem"
        />
        <div class="activity-show-details">
          <div class="block-title">
            <span class="icon"></span>
            <h3>Activity</h3>
          </div>
          <button class="show-details-btn" @click="toggleActivityDetails">Show Details</button>
        </div>
        <div
          v-click-outside="closeComment"
          :class="{ open: isComment }"
          class="comment-text-container"
        >
          <div class="comment-text">
            <avatar size="32" :name="currUser.fullname"></avatar>
            <input
              :class="{ open: isComment }"
              @click="openComment"
              @input="tagMembers(null)"
              placeholder="Write a comment..."
              type="text"
              v-model="comment"
            />
            <comment-actions
              v-if="isComment"
              :class="{ open: isComment }"
              class="comments-main-container flex space-between"
              @addComment="addComment"
              @closeComment="closeComment"
            />
          </div>
        </div>
        <activities-list
          :task="task"
          :user="miniUser"
          :showDetails="isShowActivityDetails"
          @updateItem="updateItem"
          @findMembers="tagMembers"
          :memberToAdd="memberToAdd"
        />
      </div>
      <!-- <location :card="card" /> -->
      <div class="actions-btns-container">
        <!-- <h3>Suggested</h3>
        <button>
          <span class="icon-member"></span>
          Join
        </button>-->
        <div>
          <h3>Add To card</h3>
          <button @click="setMembers('membersItem')" title="Members">
            <span class="icon-members"></span>
            Members
          </button>
          <button @click="setLabels('labelsItem')" title="Labels">
            <span class="icon-label"></span>
            Labels
          </button>
          <button @click="setChecklist('checklistItem')" title="Checklist">
            <span class="icon-checklist"></span>
            Checklist
          </button>
          <button @click="setDate('dateItem')" title="Dates">
            <span class="icon-time"></span>
            Dates
          </button>
          <button @click="setAttachments('attachmentItem')" title="Attachments">
            <span class="icon-attachment"></span>
            Attachments
          </button>
          <button @click="setLocation('locationItem')" title="Location">
            <span class="icon-location"></span>
            Location
          </button>
          <button @click="setCover('coverItem')" title="Cover">
            <span class="icon-cover"></span>
            Cover
          </button>
        </div>

        <div>
          <h3>Actions</h3>
          <button title="Copy">
            <span class="icon-copy"></span>
            Copy
          </button>
          <button title="Share">
            <span class="icon-share"></span>
            Share
          </button>
        </div>
        <popup-main
          :task="task"
          @closePopup="closePopup"
          :popupData="popupData"
          @updateCover="updateCover"
          :cmp="actionType"
          v-if="actionType"
          @addItem="addItem"
          @setItem="setItem"
          @updateLabels="updateLabels"
        />
      </div>
      <find-members v-if="isFindMembers" :board="board" class="find-members" @addTag="addTag" />
    </section>
  </section>
</template>
<script>
import { utilService } from '../services/utils-service.js';
import { boardService } from '../services/board-service.js';
import { socketService } from '../services/socket-service.js';
import popupMain from './pop-up-main.vue';
import attachment from "./attachment-cmp.vue";
import taskComboList from './task-details-cmps/task-combo-list.vue';
import taskCheckList from './task-details-cmps/task-checklist.vue';
import contenteditable from 'vue-contenteditable'
import activitiesList from './activities-list.vue'
import commentActions from './comment-actions.vue'
import findMembers from './find-members.vue'


export default {
  data() {
    return {
      taskToEdit: null,
      showSaveBtn: false,
      popupData: null,
      actionType: null,
      isDescEditMode: false,
      isComment: false,
      isShowActivityDetails: false,
      comment: '',
      isFindMembers: false,
      lastAtIndex: 0,
      memberToAdd: '',
    };
  },
  created() {
    this.taskToEdit = JSON.parse(JSON.stringify(this.task));
    this.isComment = false
  },
  methods: {
    deleteMap() {
      this.taskToEdit.location = '';
      this.onTaskEdit();
    },
    openComment() {
      this.isComment = true
      if (!this.comment) {
        this.lastAtIndex = 0
      }
    },
    addTag(member) {
      this.memberToAdd = member
      this.tagMembers()
    },
    tagMembers(id) {
      if (this.isFindMembers) {
        this.isFindMembers = !this.isFindMembers
        if (this.isComment && this.memberToAdd) {
          this.comment += this.memberToAdd.fullname
          return this.memberToAdd = ''
        }
      }
      var currTxt;
      if (id) {
        currTxt = this.task.activities.find(CurrComment => CurrComment._id === id).txt;
        this.lastAtIndex = currTxt.length - 2
      } else currTxt = this.comment;
      var atIndex = currTxt.indexOf('@', this.lastAtIndex + 1);
      if (atIndex !== -1) this.lastAtIndex = atIndex;
      if (((atIndex !== -1) && (currTxt[atIndex - 1] === " ")) || ((currTxt.length === 1) && (currTxt === "@"))) {
        this.isFindMembers = true;
      }
    },
    closeComment() {
      if (this.isComment) {
        this.lastAtIndex = 0;
        this.isComment = false
        this.comments = ''
      }
    },
    addComment() {
      this.lastAtIndex = 0;
      const item = {
        type: 'comment',
        item: {
          byMember: this.miniUser,
          createdAt: Date.now(),
          task: {
            _id: this.task._id,
            title: this.task.title,
          },
          txt: this.comment,
          _id: utilService.makeId(),
          isComment: true,
        }
      }

      const activity = boardService.addActivity(`${this.miniUser.username} mentioned you`, this.miniUser._id, this.task._id, this.group._id, this.board._id);
      item.item.txt.split(' ').forEach(txt => {
        if (txt[0] === '@') {
          const username = txt.substring(1);
          const user = this.board.members.find(member => member.fullname.split(' ')[0] === username);
          if (user) {
            activity.toMemberId = user._id;
            activity.isMention = true;
            socketService.emit('notify user tag', activity)
          }
        }
      })

      this.addItem(item);
      this.closeComment()
      this.comment = ''
    },
    setLocation(action) {
      (this.actionType = action),
        (this.popupData = { name: 'Location', style: { top: '240px' } });
    },
    setDate(action) {
      (this.actionType = action),
        (this.popupData = { name: 'Dates', style: { top: '180px' } });
    },
    updateCover(cover) {
      this.taskToEdit.cover = cover;
      this.onTaskEdit();
    },
    setMembers(action) {
      (this.actionType = action),
        (this.popupData = { name: 'Members', style: { top: '59px' } });
    },
    setLabels(action) {
      (this.actionType = action),
        (this.popupData = { name: 'Labels', style: { top: '99px' } });
    },
    setAttachments(action) {
      (this.actionType = action),
        (this.popupData = { name: 'Attachments', style: { top: '220px' } });
    },
    setChecklist(action) {
      (this.actionType = action),
        (this.popupData = { name: 'Add checklist', style: { top: '140px' } });
    },
    setCover(action) {
      this.actionType = action;
      this.popupData = { name: 'Cover', style: { top: '300px' } }
    },
    closePopup() {
      this.actionType = null
      this.popupData = null
    },
    addItem(item) {
      if (item.type === 'attachment') {
        if (!this.taskToEdit.attachments) this.taskToEdit.attachments = [];
        this.taskToEdit.attachments.push(item.item);
        this.onTaskEdit();
      } else if (item.type === 'comment') {
        if (!this.taskToEdit.activities) this.taskToEdit.activities = [];
        this.taskToEdit.activities.unshift(item.item);
      } else if (item.type === 'dueDate') {
        this.taskToEdit.dueDate = item.item;
        this.onTaskEdit();
        this.closePopup();
      }
      else if (item.type === 'status') {
        this.taskToEdit.status = item.item;
      }
      else if (item.type === 'location') {
        this.taskToEdit.location = item.item;
        this.closePopup();
      } else if (item.type === 'checklist') {
        if (!this.taskToEdit.checklists) this.taskToEdit.checklists = [];
        this.taskToEdit.checklists.push(item.item);
        this.closePopup();
      } else if (item.type === 'members') {
        if (!this.taskToEdit.members) this.taskToEdit.members = [];
        if (this.taskToEdit.members.some((member) => member._id === item.item._id)) {
          const idx = this.taskToEdit.members.findIndex((member) => member._id === item.item._id);
          this.taskToEdit.members.splice(idx, 1);
        } else {
          this.taskToEdit.members.push(item.item);
        }
      } else if (item.type === 'labels') {
        if (!this.taskToEdit.labelIds) this.taskToEdit.labelIds = [];
        if (this.taskToEdit.labelIds.includes(item.item._id)) {
          const idx = this.taskToEdit.labelIds.findIndex((label) => label === item.item._id);
          var currLabel = this.taskToEdit.labelIds[idx]
          if ((item.item.color === currLabel.color && item.item.title === currLabel.title)) {
            this.taskToEdit.labelIds.splice(idx, 1);
          }
        } else {
          this.taskToEdit.labelIds.push(item.item._id);
        }
      }
      this.onTaskEdit(item);
    },
    updateItem({ type, val }) {
      if (type === 'checklists') {
        const checklists = this.taskToEdit.checklists;
        const idx = checklists.findIndex((checklist) => checklist._id === val._id);
        if (val.title) checklists.splice(idx, 1, val); // edit
        else checklists.splice(idx, 1); // deletion
      } else if (type === 'comment') {
        const activities = this.taskToEdit.activities;
        const idx = activities.findIndex((activity) => activity._id === val._id);
        if (val.txt?.length) activities.splice(idx, 1, val); // edit
        else activities.splice(idx, 1); // deletion
      }
      else this.taskToEdit[type] = val;
      this.onTaskEdit();
    },
    onTaskEdit(action = null) {
      this.$store.dispatch({
        type: 'setTask',
        task: JSON.parse(JSON.stringify(this.taskToEdit)),
        action
      });
      this.$store.commit({ type: 'setCurrTask', task: JSON.parse(JSON.stringify(this.taskToEdit)) });
    },
    async updateLabels(updatedLabels, item) {
      if (item.item?.isDelete) return this.removeLabel(updatedLabels, item)
      try {
        await this.$store.dispatch({
          type: 'setBoardPrefs',
          key: 'labels',
          val: updatedLabels,
        });
        this.addItem(item);
        this.closePopup();
      } catch (err) {
        console.log('err', err);
      }
    },
    removeLabel(updatedLabels, item) {
      const idx = this.taskToEdit.labelIds.findIndex((label) => label === item.item._id);
      this.taskToEdit.labelIds.splice(idx, 1);
      this.onTaskEdit();
      this.closePopup();

      this.$store.dispatch({
        type: 'setBoardPrefs',
        key: 'labels',
        val: updatedLabels,
      });
    },
    cancelDescEdit() {
      this.taskToEdit.description = this.task.description;
      this.isDescEditMode = false;
    },
    saveDescEdit() {
      if (this.isDescEditMode) {
        this.onTaskEdit();
        this.isDescEditMode = false;
      }
    },
    closeModal() {
      this.$emit('closeModal')
    },
    toggleActivityDetails() {
      this.isShowActivityDetails = !this.isShowActivityDetails;
    }
  },
  computed: {
    board() {
      return this.$store.getters.currBoard;
    },
    group() {
      return this.$store.getters.currGroup;
    },
    task() {
      return JSON.parse(JSON.stringify(this.$store.getters.currTask))
    },
    currUser() {
      return this.$store.getters.user;
    },
    coverStyle() {
      return { 'background-color': this.taskToEdit.cover.color, 'background-image': 'url(' + this.taskToEdit.cover.imgUrl + ')' }
    },
    miniUser() {
      return this.$store.getters.miniUser
    }
  },
  components: {
    popupMain,
    attachment,
    taskComboList,
    taskCheckList,
    contenteditable,
    activitiesList,
    commentActions,
    findMembers,
  },
  unmounted() {
    this.lastAtIndex = 0;
    if (this.task?.activities?.length) {
      var openComments = this.task.activities.map(comment => { if (comment.isEditing) return comment })
      openComments.forEach(comment => {
        if (comment) {
          comment.isEditing = false
          this.updateItem({ type: 'comment', val: comment });
        }
      })
    }
    this.$emit('cleanStore');

  },
};
</script>