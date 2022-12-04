<template>
    <section class="create-board-modal" v-click-outside="closeModal" v-if="boardToAdd">
        <header>
            <p>Create Board</p>

            <span @click="closeModal">
                <svg
                    width="10"
                    height="10"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.58579 7L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683418 0.292893 0.292893C0.683418 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L7 5.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893C14.0976 0.683418 14.0976 1.31658 13.7071 1.70711L8.41421 7L13.7071 12.2929C14.0976 12.6834 14.0976 13.3166 13.7071 13.7071C13.3166 14.0976 12.6834 14.0976 12.2929 13.7071L7 8.41421L1.70711 13.7071C1.31658 14.0976 0.683418 14.0976 0.292893 13.7071C-0.0976311 13.3166 -0.0976311 12.6834 0.292893 12.2929L5.58579 7Z"
                        fill="currentColor"
                    />
                </svg>
            </span>
        </header>
        <div class="create-board-preview" :style="bgStyle">
            <img
                src="../images//board-preview-skeleton.14cda5dc635d1f13bc48.svg"
                alt
                role="presentation"
            />
        </div>
        <div class="background-picker-container">
            <p>Background</p>
            <div class="cover-mini-photos">
                <div v-for="pic in randPics" :key="pic._id" @click="updateBgImg(pic.full, pic._id)">
                    <img :src="pic.thumb" :class="{ 'low-opacity ': bgImg === pic._id }" />
                    <span class="icon-check" v-if="bgImg === pic._id"></span>
                </div>
            </div>
            <color-picker :bgImg="bgImg" @updateColor="updateBgColor"></color-picker>
        </div>
        <div>
            <label>
                Board title
                <span class="red-text">*</span>
                <input
                    type="text"
                    class="board-title-inp"
                    v-model="boardToAdd.title"
                    @keydown.enter="addBoard"
                />
            </label>
        </div>
        <button :disabled="!boardToAdd.title" class="create-board-btn" @click="addBoard">Create</button>
    </section>
</template>

<script>
import { boardService } from "../services/board-service.js";
import { imagesService } from '../services/images-service.js'

import colorPicker from "./color-picker.vue";
export default {
    name: 'create-board',
    data() {
        return {
            boardToAdd: null,
            randPics: null,
            bgImg: '',
            bgCurrColor: '#cacabb',
        }
    },
    async created() {
        this.boardToAdd = await boardService.getEmptyBoard();
        this.randPics = await imagesService.getImages('mountains', 4);
    },
    methods: {
        async addBoard() {
            const board = this.boardToAdd;
            const savedBoard = await this.$store.dispatch({ type: 'saveBoard', board });
            this.$store.commit({ type: 'setCurrentBoard', board: savedBoard });
            this.closeModal();
            this.$router.push(`/board/${savedBoard._id}`);

        },
        closeModal() {
            this.$emit('closeCreateModal');
        },
        updateBgColor(color) {
            this.bgCurrColor = color
            this.boardToAdd.style.bgColor = color;
            this.bgImg = '';
            this.boardToAdd.style.bgImg = '';

        },
        updateBgImg(url, id) {
            this.boardToAdd.style.bgImg = url
            this.bgImg = id
        }

    },
    computed: {
        bgStyle() {
            return { 'background-color': this.boardToAdd.style.bgColor, 'background-image': 'url(' + this.boardToAdd.style?.bgImg + ')' }
        }
    },
    components: {
        colorPicker
    }
}
</script>