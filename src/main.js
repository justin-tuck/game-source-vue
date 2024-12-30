import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'


// Toasts
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
          mdi,
        },
      },
  })


  /// FIRE BASE 
  import { AUTH } from '../firebase-config'
  import { onAuthStateChanged } from 'firebase/auth'

  let app;  
  onAuthStateChanged(AUTH, ()=>{
    if(!app) {
      app = createApp(App)
      
      app.use(createPinia())
      app.use(router)
      app.use(vuetify);
      app.use(ToastPlugin);

      app.mount('#app')
    }
  })




