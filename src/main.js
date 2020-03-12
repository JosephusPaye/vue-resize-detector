import Vue from 'vue';
import * as emojicon from 'emojicon';
import App from './App.vue';

Vue.config.productionTip = false;

emojicon.set('🔷');

new Vue({
  render: h => h(App),
}).$mount('#app');
