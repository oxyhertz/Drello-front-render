<template>
  <section class="date-item">
    <Datepicker class="date-picker" v-model="date" inline autoApply></Datepicker>
    <button @click="saveDueDate" class="save">save</button>
  </section>
</template>


<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';

export default {
  components: { Datepicker },
  data() {
    return {
      date: ref(Date.now()),
    };
  },

  methods: {
    updateStatus() {
      var status = ''
      if ((Date.parse((this.date))) < Date.now()) status = 'overdue'
      const item = {
        type: 'status',
        item: status
      }
      this.$emit('addItem', item)
    },
    saveDueDate() {
      const date = {
        type: 'dueDate',
        item: (Date.parse((this.date))),
      }
      this.$emit('addItem', date);
      this.updateStatus()
    }
  }
};
</script>