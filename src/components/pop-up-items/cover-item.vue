<template>
    <span class="icon-back cover-popup" v-if="photoSearch" @click="photoSearch = false"></span>
    <section class="cover-item" v-if="!photoSearch">
        <div class="cover-preview">
            <h4>Size</h4>
            <div class="demo-images">
                <div
                    class="demo-img"
                    :class="{ 'selected-type': coverToEdit.type === 'header' }"
                    :style="coverPreviewStyle"
                    @click="setCoverType('header')"
                >
                    <img src="../../images/demo-cover3.png" alt />
                </div>
                <div
                    class="demo-img"
                    :class="{ 'selected-type': coverToEdit.type === 'inline' }"
                    :style="coverPreviewStyle"
                    @click="setCoverType('inline')"
                >
                    <img src="../../images/demo-cover6.png" alt />
                </div>
            </div>
            <button>Remove Cover</button>
        </div>
        <div class="color-picker-container">
            <h4>Colors</h4>
            <color-picker @updateColor="updateColor"></color-picker>
        </div>
        <div class="cover-attachments">
            <h4>Attachments</h4>
            <label v-if="!isLoading" class="upload-img">
                Upload a cover image
                <input type="file" @change="onUploadImg" hidden />
            </label>
            <div v-if="isLoading" class="loader-svg">
                <img src="../../images/loader.svg" alt />
            </div>
        </div>
        <h4>Photos from Unsplash</h4>
        <div class="cover-mini-photos">
            <div
                v-for="pic in randPics"
                :key="pic._id"
                @click="setImgUrl(pic.sm)"
                :class="{ 'selected-type': pic.sm === coverToEdit.imgUrl }"
            >
                <img :src="pic.thumb" alt />
            </div>
            <button @click="photoSearch = true">Search for photos</button>
        </div>
    </section>
    <search-photo v-else :coverToEdit="coverToEdit" @setImgUrl="setImgUrl"></search-photo>
</template>

<script>
import colorPicker from '../color-picker.vue'
import searchPhoto from '../pop-up-items/search-photo-item.vue'
import { uploadImg } from '../../services/imgUpload.service.js'
import { imagesService } from '../../services/images-service.js'
export default {
    name: 'cover-item',
    data() {
        return {
            isLoading: false,
            coverToEdit: {
                color: null,
                imgUrl: null,
                type: null,
            },
            randPics: null,
            photoSearch: false,
        }
    },
    async created() {
        this.randPics = await imagesService.getRandomImages(6)
        this.coverToEdit.color = this.currTask?.cover?.color ? this.currTask?.cover.color : '#cfd3da'
        this.coverToEdit.imgUrl = this.currTask?.cover?.imgUrl ? this.currTask?.cover?.imgUrl : '';
        this.coverToEdit.type = this.currTask?.cover?.type ? this.currTask?.cover?.type : 'header'
    },
    methods: {
        async onUploadImg(ev) {
            this.isLoading = true;
            const file = ev.target.files[0]
            const res = await uploadImg(file);
            this.coverToEdit.imgUrl = res.url
            this.isLoading = false;
            this.updateCover()
        },
        setCoverType(type) {
            this.coverToEdit.type = type;
            this.updateCover()
        },
        updateColor(color) {
            this.coverToEdit.color = color
            this.updateCover()
        },
        updateCover() {
            this.$emit('updateCover', this.coverToEdit)
        },
        setImgUrl(url) {
            this.coverToEdit.imgUrl = url
            this.updateCover()

        },

    },
    computed: {
        currColor() {

        },

        currTask() {
            return this.$store.getters.currTask
        },
        coverPreviewStyle() {
            return { 'background-color': this.coverToEdit.color, 'background-image': 'url(' + this.coverToEdit.imgUrl + ')' }
        }
    },
    components: {
        colorPicker,
        searchPhoto
    }
}
</script>