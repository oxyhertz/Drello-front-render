<template>
    <section class="search-photo-container">
        <input
            v-focus
            class="inline-input"
            type="text"
            v-model="keyword"
            placeholder="Search for unsplash photos"
            @change="setPics"
        />
        <h4>Suggested searches</h4>
        <div class="suggested-searches">
            <button
                v-for="search in suggSearches"
                :key="search"
                @click="keyword = search, setPics()"
            >{{ search }}</button>
        </div>
        <h4>Top photos</h4>
        <div class="cover-mini-photos">
            <div
                v-for="pic in randPics"
                :key="pic._id"
                @click="setImgUrl(pic.sm)"
                :class="{ 'selected-type': pic.sm === coverToEdit.imgUrl }"
            >
                <img :src="pic.thumb" alt />
            </div>
        </div>
    </section>
</template>
<script>
import { utilService } from '../../services/utils-service.js'
import { imagesService } from '../../services/images-service.js'

export default {
    name: 'search-photo-item',
    props: ['coverToEdit'],
    data() {
        return {
            keyword: '',
            suggSearches: utilService.getRandomWord(9),
            randPics: null,
        }
    },
    async created() {
        this.randPics = await imagesService.getRandomImages(12);
    },
    methods: {
        async setPics() {
            this.randPics = await imagesService.getImages(this.keyword, 12)
        },
        setImgUrl(url) {
            this.$emit('setImgUrl', url)
        }
    }

}
</script>
