<template>
    <section class="color-picker">
        <div
            v-for="color in colors"
            :title="color.title"
            :style="{ 'background-color': color.color }"
            :key="color.title"
            @click="updateColor(color.color)"
        >
            <span class="icon-complete" v-if="currColor === color.color && !bgImg"></span>
        </div>
    </section>
</template>


<script>
export default {
    name: 'color-picker',
    props: {
        importedColors: Array,
        bgImg: String
    },
    data() {
        return {
            currColor: '',
            colors: [
                { color: 'rgb(0, 121, 191)', title: '' },
                { color: 'rgb(210, 144, 52)', title: '' },
                { color: 'rgb(81, 152, 57)', title: '' },
                { color: 'rgb(176, 70, 50)', title: '' },
                { color: 'rgb(137, 96, 158)', title: '' },
                { color: 'rgb(205, 90, 145)', title: '' },
                { color: 'rgb(75, 191, 107)', title: '' },
                { color: 'rgb(0, 174, 204)', title: '' },
                { color: 'rgb(131, 140, 145)', title: '' },
                { color: '#f5dd29', title: '' },
            ],
        }
    },
    methods: {
        updateColor(color) {
            this.selectedColor = true
            this.currColor = color;
            this.$emit('updateColor', color, 'bgColor');
        },
    },

}
</script>