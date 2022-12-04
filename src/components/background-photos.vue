<template >
    <section class="background-photos">
        <input
            type="text"
            v-focus
            class="popup-inp"
            v-model="keyword"
            placeholder="Search photos"
            @change="setPics"
            @keydown.enter="setPics"
        />
        <div v-if="randPics" class="photos">
            <div v-for="pic in randPics" :key="pic._id" @click="setBgImg(pic.full)">
                <img :src="pic.thumb" alt />
            </div>
        </div>
    </section>
</template>
<script>
import { uploadImg } from '../services/imgUpload.service.js'
import { imagesService } from '../services/images-service'
export default {
    data() {
        return {
            randPics: null,
            keyword: ''
        }
    },
    async created() {
        this.randPics = await imagesService.getRandomImages(20)
    },
    methods: {
        async setPics() {
            this.randPics = await imagesService.getImages(this.keyword, 20)
        },
        setBgImg(url) {
            this.$emit('setBg', { type: 'bgImg', val: url })
        }
    }
}
</script>
<style >
</style>