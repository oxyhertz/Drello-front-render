import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/style.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { focusDirective } from './directives/'
import Avatar from 'vue3-avatar'
import vClickOutside from 'click-outside-vue3'
import timeago from 'vue-timeago3'
import GAuth from 'vue3-google-oauth2'
import VueGoogleMaps from '@fawmi/vue-google-maps'

import './styles/setup/_typography.scss'

const app = createApp(App).component('avatar', Avatar)
app.directive('focus', focusDirective)

const gAuthOptions = {
  clientId:
    '259143911327-0c53jftjilthpbel1ctuab58cef805bk.apps.googleusercontent.com',
  prompt: 'consent',
}
app.use(GAuth, gAuthOptions)

app.use(vClickOutside)
app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(timeago)
app.use(VueGoogleMaps, {
  load: {
    key: `AIzaSyDtacGFKDZu-p73ElA1OFnZCeT-jGafFHw`,
    libraries: 'places',
  },
})
app.mount('#app')
