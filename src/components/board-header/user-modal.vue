<template>
    <section class="user-modal">
        <header>
            <h4>Account</h4>
            <span class="icon-cancel" @click="closeModal"></span>
        </header>
        <article>
            <avatar size="40" :name="user.fullname"></avatar>
            <div>
                <p>{{ user.fullname }}</p>
                <span>{{ user.username }}</span>
            </div>
        </article>
        <div class="logout" @click="logout">
            <p>Logout</p>
        </div>
    </section>
</template>
<script>
export default {
    name: 'user-modal',
    props: {
        user: Object
    },
    methods: {
        closeModal() {
            this.$emit('closeModal')
        },
        async logout() {
            await this.$store.dispatch({ type: 'logout' });
            this.$router.push('/login');
            this.closeModal();

        },
    }
}
</script>
