<template >
    <section class="more-popup">
        <header>
            <h4>More</h4>
            <span class="icon-cancel" @click="$emit('closeMoreModal')"></span>
        </header>
        <main>
            <ul>
                <li @click="openBoards('recent')">
                    <p>Recent Boards</p>
                    <svg
                        width="16"
                        height="16"
                        role="presentation"
                        focusable="false"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16.7071 12.7071L9.63606 19.7781C9.24554 20.1687 8.61237 20.1687 8.22185 19.7781C7.83132 19.3876 7.83132 18.7544 8.22185 18.3639L14.5858 12L8.22185 5.636C7.83132 5.24548 7.83132 4.61231 8.22185 4.22179C8.61237 3.83126 9.24554 3.83126 9.63606 4.22179L16.7071 11.2929C17.0977 11.6834 17.0977 12.3165 16.7071 12.7071Z"
                            fill="currentColor"
                        />
                    </svg>
                </li>
                <li @click="openBoards('starred')">
                    <p>Starred Boards</p>
                    <svg
                        width="16"
                        height="16"
                        role="presentation"
                        focusable="false"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16.7071 12.7071L9.63606 19.7781C9.24554 20.1687 8.61237 20.1687 8.22185 19.7781C7.83132 19.3876 7.83132 18.7544 8.22185 18.3639L14.5858 12L8.22185 5.636C7.83132 5.24548 7.83132 4.61231 8.22185 4.22179C8.61237 3.83126 9.24554 3.83126 9.63606 4.22179L16.7071 11.2929C17.0977 11.6834 17.0977 12.3165 16.7071 12.7071Z"
                            fill="currentColor"
                        />
                    </svg>
                </li>
            </ul>
        </main>
    </section>
</template>
<script>
export default {
    name: 'more-popup',
    methods: {
        openBoards(type) {
            if (type === 'recent') {
                this.$emit('openRecent')
            } else {
                this.$emit('openStarred')
            }
            this.$emit('closeMoreModal')
        }
    }
}
</script>
