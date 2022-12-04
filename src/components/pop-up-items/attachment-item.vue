<template >
    <div class="attachment-item">
        <label
            v-if="!isLoading"
            for="imgUploader"
            @drop.prevent="handleFile"
            @dragover.prevent
            class="drag-container"
        >
            <h3>Choose an image or drag it here</h3>
            <!-- <img src="https://clippingpathgreat.com/wp-content/uploads/2021/04/upload-files-1024x707.jpg" alt=""> -->
            <!-- <input hidden type="file" @change="onUploadImg"/> -->
        </label>
        <img v-else src="../../images/loader.svg" alt />
        <input hidden type="file" name="img-uploader" id="imgUploader" @change="handleFile" />
        <label class="attach-link" for="attach-link">Attach a link</label>
        <input v-model="imgUrl" v-focus type="text" name id="attach-link" />
        <button @click="AddAttachment">Attach</button>
    </div>
</template>


<script>
import { utilService } from '../../services/utils-service'
import { uploadImg } from '../../services/imgUpload.service'

export default {
    name: 'attachment-item',
    data() {
        return {
            isLoading: false,
            isDragOver: false,
            attachment: {
                createdAt: null,
                fileName: null,
                url: null,
                type: 'image',
                id: utilService.makeId()
            },
            imgUrl: ''

        }
    },
    methods: {
        handleFile(ev) {
            //added to determine if its change from input or drop , and gets the file
            let file;
            if (ev.type === 'change') file = ev.target.files[0];
            else if (ev.type === 'drop') file = ev.dataTransfer.files[0];
            this.onUploadImg(file); // send the file to upload it
        },
        async onUploadImg(file) {
            this.isLoading = true
            const fileName = file.name;
            const res = await uploadImg(file)
            this.setAttachment(res.url, fileName)
            const item = {
                type: 'attachment',
                item: JSON.parse(JSON.stringify(this.attachment))
            }
            this.$emit('addItem', item)
            this.isLoading = false;
            this.$emit('closePopup')
        },
        async AddAttachment() {
            const fileName = this.imgUrl.substring(this.imgUrl.lastIndexOf('/') + 1);
            this.setAttachment(this.imgUrl, fileName)
            const item = {
                type: 'attachment',
                item: JSON.parse(JSON.stringify(this.attachment))
            }
            this.$emit('addItem', item)
            this.$emit('closePopup')

        },
        setAttachment(url, filename) {
            this.attachment.createdAt = Date.now()
            this.attachment.url = url;
            this.attachment.fileName = filename
        }
    }

}
</script>
