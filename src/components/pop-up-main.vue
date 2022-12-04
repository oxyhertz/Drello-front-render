<template>
  <div ref="popup" class="pop-up-main" :style="popupData.style" v-click-outside="closePopup">
    <header>
      <p>{{ popupData.name }}</p>
      <span @click="$emit('closePopup')">
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
      <component
        :is="cmp"
        @addItem="addItem"
        :board="currBoard"
        @updateLabels="updateLabels"
        @closePopup="closePopup"
        @updateCover="updateCover"
        :task="task"
      ></component>
    </main>
  </div>
</template>


<script>
import dateItem from './pop-up-items/date-item.vue';
import labelsItem from './pop-up-items/labels-item.vue';
import membersItem from './pop-up-items/members-item.vue';
import checklistItem from './pop-up-items/checklist-item.vue';
import attachmentItem from './pop-up-items/attachment-item.vue';
import coverItem from './pop-up-items/cover-item.vue';
import locationItem from './pop-up-items/location-item.vue';

export default {
  name: 'pop-up-main',
  props: {
    popupData: Object,
    cmp: String,
    task: Object

  },

  mounted() {
    this.$emit('popupHeight', this.$refs.popup.clientHeight)
  },
  methods: {
    updateCover(cover) {
      this.$emit('updateCover', cover)
    },
    updateLabels(updatedLabels, item) {
      this.$emit('updateLabels', updatedLabels, item);
    },
    closePopup() {
      this.$emit('closePopup');
    },
    addItem(item) {
      this.$emit('addItem', item);
    },
    removeItem() { },
  },
  computed: {
    currBoard() {
      return this.$store.getters.currBoard;
    },
  },
  components: {
    labelsItem,
    checklistItem,
    attachmentItem,
    coverItem,
    dateItem,
    membersItem,
    locationItem,
  },
};
</script>
