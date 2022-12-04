import { createStore } from 'vuex';
import boardStore from './modules/board-store';
import userStore from './modules/user-store';

const store = createStore({
  strict: true,
  state: {
    isHomePage: false,
  },
  getters: {
    isHomePage({ isHomePage }) {
      return isHomePage
    }
  },
  mutations: {
    setHomePage(state, { isHome }) {
      state.isHomePage = isHome
      console.log(state.isHomePage)
    }
  },
  actions: {},
  modules: {
    boardStore,
    userStore,
  },
});

export default store;
