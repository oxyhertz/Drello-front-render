import { userService } from '../../services/user-service';
// import { userManageService } from '../../services/user-manage-service';
import { utilService } from '../../services/utils-service';
import { socketService } from '../../services/socket-service'

export default {
  state: {
    loggedinUser: userService.getLoggedinUser(),
    allUsers: [],
  },
  getters: {
    user(state) {
      return state.loggedinUser;
    },
    getAllUsers(state) {
      return state.allUsers;
    },
    miniUser({ loggedinUser }) {
      if (!loggedinUser) return;
      const miniUser = {
        _id: loggedinUser._id,
        fullname: loggedinUser.fullname,
        username: loggedinUser.username,
        imgUrl: loggedinUser.imgUrl,
      };
      return miniUser;
    },
  },
  mutations: {
    setLoggedinUser(state, { user }) {
      if (user) socketService.emit('set-user-socket', user._id);
      else socketService.emit('unset-user-socket');
      state.loggedinUser = user;
    },
    setUsers(state, { users }) {
      state.allUsers = users;
    },
    addRecentBoard(state, { boardId }) {
      const user = userService.addRecentBoard(boardId);
      state.loggedinUser = user;
    },
    setUser(state, { user }) {
      state.loggedinUser = user
    },
    updateActivities(state, { activity }) {
      state.loggedinUser.activities.unshift(activity)
      userService.saveLocalUser(state.loggedinUser)
    },
    toggleActivity(state, { activityId }) {
      const idx = state.loggedinUser.activities.findIndex(activity => activity._id === activityId);
      state.loggedinUser.activities[idx].isReaden = !state.loggedinUser.activities[idx].isReaden;
      userService.saveLocalUser(state.loggedinUser)
    },
    toggleAllActivities(state) {
      state.loggedinUser.activities.forEach(activity => activity.isReaden = true)
      userService.saveLocalUser(state.loggedinUser)
    }
  },
  actions: {
    async loadUsers({ commit, state }) {
      try {
        const users = await userService.getUsers();
        commit({ type: 'setUsers', users });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    async login({ commit }, { cred }) {
      try {
        const user = await userService.login(cred);
        commit({ type: 'setLoggedinUser', user });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    async signup({ commit }, { cred }) {
      try {
        const user = await userService.signup(cred);
        commit({ type: 'setLoggedinUser', user });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    async logout({ commit }) {
      try {
        await userService.logout();
        commit({ type: 'setLoggedinUser', user: null });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    async updateUser({ commit }, { user }) {
      try {
        await userService.update(user)
        commit({ type: 'setUser', user })
      } catch (err) {
        console.log(err)
        throw err
      }
    },
    async toggleActivity({ commit, dispatch, state }, { activityId }) {
      try {
        commit({ type: 'toggleActivity', activityId })
        await dispatch({ type: 'updateUser', user: state.loggedinUser })
      } catch (err) {
        throw err
      }
    },
    async toggleAllActivities({state, commit, dispatch}) {
      try {
      commit({type: 'toggleAllActivities'})
      await dispatch({ type: 'updateUser', user: state.loggedinUser })
    } catch (err) {
      throw err
    }
  },
  }}
