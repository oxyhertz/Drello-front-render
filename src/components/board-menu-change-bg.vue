<template >
    <section class="change-bg-menu">
        <section>
            <div>
                <div class="img" @click="setCmp('bgPhotos')"></div>
                <span>Images</span>
            </div>
            <div>
                <div class="color" @click="setCmp('colorPicker')"></div>
                <span>Colors</span>
            </div>
        </section>
        <div class="custom-bg">
            <h2>Custom</h2>
            <label for="imgInput">
                <div class="add-bg">
                    <span class="icon-plus"></span>
                </div>
            </label>
            <input hidden type="file" name="img-input" id="imgInput" @change="onUploadImg" />
        </div>
    </section>
</template>
<script>
import { uploadImg } from '../services/imgUpload.service'

export default {
    methods: {
        setCmp(cmp) {
            this.$emit('changeCmp', cmp)
        },
        async onUploadImg(ev) {
            this.isLoading = true;
            const res = await uploadImg(ev.target.files[0]);
            this.$emit('save', res.url);
            this.$emit('setBg', { type: 'bgImg', val: res.url })
            this.isLoading = false;
        },
    }
}
</script>
<style>
</style>