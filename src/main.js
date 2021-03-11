import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import store from './store'
import router from './router'
import VueTextToSpeech from 'vue-text-to-speech';
import vuetify from './plugins/vuetify';
import VueSweetalert2 from 'vue-sweetalert2';
import axios from 'axios';
import CircularCountDownTimer from "vue-circular-count-down-timer";
import { firestorePlugin } from 'vuefire';
import { fb } from './firebase';
import VueChatScroll from 'vue-chat-scroll'
import Notifications from 'vue-notification'

import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(Vuex);

Vue.use(VueTextToSpeech);

Vue.use(VueChatScroll) // Init for vue chat scroll
 
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAXnmMEpESGpkuA44mVhV4ibAmxfBmDF5o',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
 
    //// If you want to set the version, you can do so:
    // v: '3.26',
  },
 
  //// If you intend to programmatically custom event listener code
  //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  //// you might need to turn this on.
  // autobindAllEvents: false,
 
  //// If you want to manually install components, e.g.
  //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  //// Vue.component('GmapMarker', GmapMarker)
  //// then disable the following:
  // installComponents: true,
})

Vue.use(Notifications)

Vue.use(firestorePlugin)


import CKEditor from '@ckeditor/ckeditor5-vue';


Vue.prototype.$axios = axios;
Vue.config.productionTip = false


import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete';

Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: 'AIzaSyAXnmMEpESGpkuA44mVhV4ibAmxfBmDF5o', // Can also be an object. E.g, for Google Maps Premium API, pass `{ client: <YOUR-CLIENT-ID> }`
  version: '...', // Optional
});


Vue.use(CKEditor);

Vue.use(require('vue-moment')); // Vue plugin for converting timestamp to date

Vue.use(VueSweetalert2); // SweetAlert2 plguin for Vuejs

Vue.use(CircularCountDownTimer); // Circular Countdown Timer





let app;
fb.auth().onAuthStateChanged(user => {
  console.log(user);
  if(!app) {
    app = new Vue({
      router,
      vuetify,
      render: h => h(App),
      store: store
    }).$mount('#app')
  }
})
/* 

new Vue({
  router,
  vuetify,
  data: () => ({ restaurants: [] }),

  firestore: {
    restaurants: db.collection("restaurants"),
  },
  render: h => h(App)
}).$mount('#app');
 */
