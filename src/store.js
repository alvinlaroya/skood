import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store(
  {
    state: {
      authenticated: false,
      isDispatcher: false,
      isAdmin: false,
    },
    mutations: {
      setAuthentication(state, status) {
        state.authenticated = status;
      },
      setIsDispatcher(state, status) {
          state.isDispatcher = status;
      },
      setIsAdmin(state, status) {
          state.isAdmin = status;
      }
    }
  }
)

export default store;