<template>
  <section v-if="isCreating" class="task-add open">
    <textarea
      v-focus
      v-model="title"
      type="textarea"
      placeholder="Enter a title for this card..."
      class="inline-input"
      @keydown.prevent.enter="addTask"
    />
    <section class="add-task-btns">
      <button @click="addTask" class="add-card-btn">Add card</button>
      <span class="icon-cancel" @click="isCreating = false"></span>
    </section>
  </section>

  <section v-else @click="isCreating = true" class="task-add">
    <span class="plus-icon"></span>
    <span class="add-task-txt">Add a card</span>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isCreating: null,
      title: '',
    };
  },
  methods: {
    addTask() {
      if (!this.title || this.title === '\n') return this.title = '';
      this.$emit('addTask', this.title);
      this.isCreating = null;
      this.title = '';
    },
  },
};
</script>

<style>
</style>