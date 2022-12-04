<template>
    <section class="group-edit-popup">
        <header>
            <p>List actions</p>
            <span class="icon-cancel" @click="closePopup"></span>
        </header>
        <main>
            <p @click="removeGroup">Delete list...</p>
        </main>
    </section>
</template>


<script>
export default {
    name: 'group-edit-popup',
    props: {
        group: Object
    },
    data() {
        return {

        }
    },
    methods: {
        closePopup() {
            this.$emit('closePopup');
        },
        removeGroup() {
            this.$emit('removeGroup', this.group._id);
            this.$emit('closePopup');
        }
    }
}
</script>
