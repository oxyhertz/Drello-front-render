<template>
    <section
        class="add-group"
        :class="{ editable: isFocused }"
        @click="isFocused = true"
        v-click-outside="close"
    >
        <span v-if="!isFocused" class="add-group-btn">
            <span class="icon-plus"></span>
            Add another list
        </span>

        <section v-else class="group-add-input-container">
            <input
                type="text"
                class="inline-input"
                v-model="groupTitle"
                v-focus
                @keydown.enter="addGroup"
                placeholder="Enter list title..."
                ref="addGroupInput"
            />
            <section class="add-group-btns">
                <button @click="addGroup" class="add-group-btn">Add list</button>
                <span class="icon-cancel" @click.stop="close"></span>
            </section>
        </section>
    </section>
</template>


<script>

export default {
    name: 'add-group',
    data() {
        return {
            isFocused: false,
            groupTitle: ''
        }
    },
    methods: {
        addGroup() {
            if (!this.groupTitle) return;
            this.$emit('add', this.groupTitle);
            this.groupTitle = '';
            this.$refs.addGroupInput.focus();
        },
        close() {
            this.isFocused = false;
        }
    }
}
</script>