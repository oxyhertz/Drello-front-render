<template >
    <section class="quick-edit">
        <div class="btn" @click="openTask">
            <span class="icon-board"></span>Open card
        </div>
        <div
            ref="editLabels"
            class="btn"
            @click="setCmp('labelsItem', { name: 'Labels', style: labelsStyle })"
        >
            <span class="icon-label"></span>Edit Labels
        </div>
        <div
            ref="editMembers"
            class="btn"
            @click="setCmp('membersItem', { name: 'Members', style: labelsStyle })"
        >
            <span class="icon-members"></span>Change members
        </div>
        <div class="btn" @click="setCmp('coverItem', { name: 'Members', style: labelsStyle })">
            <span class="icon-cover"></span>Change cover
        </div>
        <div class="btn" @click="setCmp('dateItem', { name: 'Dates', style: labelsStyle })">
            <span class="icon-time"></span>Edit Dates
        </div>
        <div class="btn" @click.stop="$emit('removeTask')">
            <span class="icon-cancel"></span>
            Remove
        </div>
        <popup-main
            ref="popup"
            :task="task"
            :popupData="popupData"
            :cmp="actionType"
            v-if="actionType"
            @addItem="addItem"
            @updateLabels="updateLabels"
            @closePopup="actionType = ''"
            @updateCover="updateCover"
            @popupHeight="setPopupHeight"
        />
    </section>
</template>
<script>
import popupMain from './pop-up-main.vue';
export default {
    name: 'quick-edit',
    props: {
        task: Object,
    },
    data() {
        return {
            actionType: '',
            popupData: null,
            taskToEdit: null,
            popupHeight: null,
        }
    },
    created() {
        this.taskToEdit = JSON.parse(JSON.stringify(this.task))
    },
    mounted() {
        const rect = this.$refs.editLabels.getBoundingClientRect();

    },
    methods: {
        openTask() {
            this.$emit('openTask')
        },
        setPopupHeight(height) {
            this.popupHeight = height;
        },
        setCmp(type, data) {
            this.actionType = type;
            this.popupData = data
        },
        updateLabels(updatedLabels, item) {

        },
        updateCover(cover) {

            this.taskToEdit.cover = cover;
            this.$emit('addItem', this.taskToEdit)
        },
        addItem(item) {
            if (item.type === 'labels') {
                if (!this.taskToEdit.labelIds) this.taskToEdit.labelIds = [];
                if (this.taskToEdit.labelIds.includes(item.item._id)) {
                    const idx = this.taskToEdit.labelIds.findIndex((label) => label === item.item._id);
                    this.taskToEdit.labelIds.splice(idx, 1);
                } else {
                    this.taskToEdit.labelIds.push(item.item._id);
                }
            }
            if (item.type === 'members') {
                if (!this.taskToEdit.members) this.taskToEdit.members = [];
                if (this.taskToEdit.members.some((member) => member._id === item.item._id)) {
                    const idx = this.taskToEdit.members.findIndex((member) => member._id === item.item._id);
                    this.taskToEdit.members.splice(idx, 1);
                } else {
                    this.taskToEdit.members.push(item.item);
                }
                this.$store.dispatch({
                    type: 'setTask',
                    task: JSON.parse(JSON.stringify(this.taskToEdit)),
                    action: item
                });
                this.$store.commit({ type: 'setCurrTask', task: JSON.parse(JSON.stringify(this.taskToEdit)) });
            }
            if (item.type === 'dueDate') {
                if (!this.taskToEdit.dueDate) this.taskToEdit.dueDate = [];
                this.taskToEdit.dueDate = item.item;
            }
            this.$emit('addItem', this.taskToEdit)
        },
        async updateLabels(updatedLabels, item) {
            try {
                await this.$store.dispatch({
                    type: 'setBoardPrefs',
                    key: 'labels',
                    val: updatedLabels,
                });
                this.addItem(item);
                // this.closePopup();
            } catch (err) {
            }
        },

    },
    computed: {
        labelsStyle() {
            let top = this.$refs.editLabels.getBoundingClientRect().bottom;
            const right = this.$refs.editLabels.getBoundingClientRect().x;
            if (window.innerHeight - top - this.popupHeight < 0) {

                top = this.popupHeight + (window.innerHeight - top - this.popupHeight)
            }
            return { top: top + 'px', left: right + 'px', position: 'fixed' }
        },
        membersStyle() {
            const top = this.$refs.editMembers.getBoundingClientRect().bottom;
            const right = this.$refs.editMembers.getBoundingClientRect().x;

            return { top: top + 'px', left: right + 'px', position: 'fixed' }
        }
    },
    components: {
        popupMain
    },
}
</script>
<style lang="">
    
</style>