import './assets/main.scss'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { store } from './stores/global'

const m = () => {
    const app = createApp(App)

    app.use(store)
    app.use(router)
    app.mount('#app')
}

m()

declare global {
    interface Window {
        $notification: any;
        $app: any;
    }
}
