<template >
    <section class="attachments-container">
        <ul>
            <attachmentPreview
                @removeAttachment="removeAttachment"
                v-for="attachment in attachments"
                :attachment="attachment"
                :key="attachment.id"
            />
        </ul>
    </section>
</template>

<script>
import attachmentPreview from './attachment-preview.vue'
export default {
    name: 'attachment',
    props: {
        attachments: Array
    },
    data() {
        return {
        }
    },
    methods: {
        removeAttachment(attachmentId) {
            const idx = this.attachments.findIndex(attachment => attachmentId === attachment.id)
            this.attachments.splice(idx, 1);
            this.updateAttachments(JSON.parse(JSON.stringify(this.attachments)))
        },
        // updateAttachments(attachments){
        //     this.$emit('updateAttachments',attachments)
        // },
        updateAttachments(attachments) {
            this.$emit('updateAttachments', { type: 'attachments', val: attachments })
        }

    },
    components: {
        attachmentPreview
    }
}
</script>
