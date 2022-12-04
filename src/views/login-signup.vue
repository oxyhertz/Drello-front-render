<template>
    <section class="login-wrapper">
        <section class="main-container">
            <header>
                <span class="icon-trello"></span>
                <h1>Drello</h1>
            </header>
            <main class="login-container">
                <h2>Log in to Drello</h2>
                <form @submit.prevent>
                    <input type="text" v-model="user.username" placeholder="Enter Username" />
                    <input
                        v-if="!isLogin"
                        v-model="user.fullname"
                        type="text"
                        placeholder="Enter Full Name"
                    />
                    <input type="password" v-model="user.password" placeholder="Enter Password" />

                    <button class="login-btn" @click="onLoginSignup">{{ loginSignupBtnTxt }}</button>

                    <div class="login-option-sep">Or</div>

                    <button class="login-with-google" @click="handleGoogleLogin">
                        <span class="google-icon"></span>
                        <span class="btn-txt">Continue with Google</span>
                    </button>
                </form>

                <hr />
                <p @click="toggleLoginSignup" class="change-form-link">{{ loginSignupLinkTxt }}</p>
            </main>
        </section>
    </section>
</template>


<script>

export default {
    name: 'login-signup',
    data() {
        return {
            user: {
                fullname: '',
                username: '',
                password: ''
            },
            isLogin: true
        }
    },
    created() {
        this.isLogin = (this.$route.path === '/login');
    },
    mounted() {
        this.setHomePage(true)
    },
    methods: {
        async onLoginSignup() {
            try {
                const actionType = this.isLogin ? 'login' : 'signup';
                await this.$store.dispatch({ type: actionType, cred: this.user });
                this.$router.push('/board');
            } catch (err) {
                console.log(err)
            }
        },
        async handleGoogleLogin() {
            try {
                const googleUser = await this.$gAuth.signIn();
                if (!googleUser) return;

                const userId = googleUser.getBasicProfile().getId();
                const username = googleUser.getBasicProfile().getEmail();
                const fullname = googleUser.getBasicProfile().getName();
                const imgUrl = googleUser.getBasicProfile().getImageUrl();

                const userToSave = { username, fullname, password: userId, imgUrl }
                try {
                    await this.$store.dispatch({ type: 'login', cred: userToSave });
                } catch (err) {
                    await this.$store.dispatch({ type: 'signup', cred: userToSave });
                }
                this.$router.push('/board');

            } catch (err) {
                console.log(err);
            }
        },
        toggleLoginSignup() {
            this.isLogin = !this.isLogin;
            // this.user.fullname = '';
            // this.user.username = '';
            // this.user.password = '';
        },
        setHomePage(isHome) {
            this.$store.commit({ type: 'setHomePage', isHome })
        }
    },
    unmounted() {
        this.setHomePage(false)
    },
    computed: {
        loginSignupBtnTxt() {
            return this.isLogin ? 'Login' : 'Signup';
        },
        loginSignupLinkTxt() {
            return this.isLogin ? 'Sign up for an account' : 'Already have an account? Log in';
        }
    }
}
</script>