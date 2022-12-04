<template>
    <section class="checklist-popup flex column">
        <label for="checklist-input">Title</label>
        <input
            type="text"
            v-focus
            v-model="checklistTitle"
            id="checklist-input"
            placeholder="Checklist"
        />
        <button class="save" @click="addCheckList">Add</button>
    </section>
</template>


<script>
import { utilService } from '../../services/utils-service';

export default {
    name: 'checklist-popup',
    data() {
        return {
            checklistTitle: ''
        }
    },
    methods: {
        addCheckList() {
            if (!this.checklistTitle) this.checklistTitle = 'Checklist';
            const checklist = {
                _id: utilService.makeId(),
                title: this.checklistTitle,
                todos: []
            }
            this.$emit('addItem', { type: 'checklist', item: checklist });
        }
    }
}
</script>
