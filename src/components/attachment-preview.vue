<template >
    <li class="attachment-item">
        <div class="image-container">
            <img :src="attachment.url" alt />
        </div>
        <div class="attachment-details">
            <h4>{{ attachment.fileName }}</h4>
            <div class="main-actions">
                Added
                <span>{{ createdAt }} -</span>
                <span class="attachment-action">Comment</span> -
                <span
                    class="attachment-action"
                    @click.stop="removeAttachment(attachment.id)"
                >Delete</span> -
                <span class="attachment-action">Edit</span>
            </div>
            <div>
                <span class="attachment-action">Make Cover</span>
            </div>
        </div>
    </li>
</template>
<script>
import moment from 'moment';

export default {
    name: 'attachment-preview',
    props: {
        attachment: Object,
    },
    methods: {
        removeAttachment(attachmentId) {
            this.$emit('removeAttachment', attachmentId)
        },
    },
    computed: {
        createdAt() {
            // return moment(this.attachment.createdAt).format();
            return moment(this.attachment.createdAt).startOf('hour').fromNow();
            return moment(this.attachment.createdAt).startOf('day').fromNow();
        }
    }
}
</script>
