import { boardService } from '../../services/board-service.js';
import { utilService } from '../../services/utils-service.js';
import { socketService } from '../../services/socket-service.js';
import { userService } from '../../services/user-service.js';

export default {
  state: {
    boards: [],
    currentBoard: null,
    currentGroup: null,
    currentTask: null,
    openLabels: false
  },
  getters: {
    openLabel({ openLabels }) {
      return openLabels
    },
    boards({ boards }) {
      return boards;
    },
    boardsToShow({ boards, filterBy }) {
      const copyBoards = JSON.parse(JSON.stringify(boards));
      return copyBoards;
    },
    currBoard({ currentBoard }) {
      return currentBoard;
    },
    boardGroups({ currentBoard }) {
      return currentBoard?.groups;
    },
    currGroup({ currentGroup }) {
      return currentGroup;
    },
    currTask({ currentTask }) {
      return currentTask;
    }
  },
  mutations: {
    toggleLabel(state) {
      state.openLabels = !state.openLabels
    },
    setBoards(state, { boards }) {
      state.boards = boards;
    },
    saveBoard(state, { board }) {
      const idx = state.boards.findIndex(b => b._id === board._id);
      if (idx !== -1) state.boards.splice(idx, 1, board);
      else state.boards.push(board);
    },
    updateBoard(state, { key, val }) {
      state.currentBoard[key] = val;
    },
    removeBoard(state, { boardId }) {
      const idx = state.boards.findIndex(board => board._id === boardId);
      state.boards.splice(idx, 1);
    },
    setFilter(state, { filterBy }) {
      state.filterBy = filterBy;
    },
    setCurrGroup(state, { group }) {
      state.currentGroup = group;
    },
    setCurrTask(state, { task }) {
      state.currentTask = task;
    },
    setSort(state, { sortBy }) {
      state.sortBy = sortBy;
    },
    setCurrentBoard(state, { board }) {
      state.currentBoard = board;
    },
    addGroup(state, { group }) {
      state.currentBoard.groups.push(group);
      // const activity = boardService.addActivity('Added group', userService.getLoggedinUser(), { type: 'group', _id: group._id, title: group.title })
      // state.currentBoard.activities.unshift(activity);
    },
    removeGroup(state, { groupId }) {
      const idx = state.currentBoard.groups.findIndex(group => group._id === groupId);
      const { _id, title } = state.currentBoard.groups[idx];
      state.currentBoard.groups.splice(idx, 1);

      const activity = boardService.addActivity('removed group', userService.getLoggedinUser(), { type: 'group', _id, title })
      state.currentBoard.activities.unshift(activity);
    },
    setCurrGroups(state, { groups }) {
      state.currentBoard.groups = groups;
    },
    setGroup(state, { groupIdx, newGroup }) {
      state.currentBoard.groups.splice(groupIdx, 1, newGroup);
    },
    setTask(state, { groupId, task, action }) {
      let groupIdx;
      let activityTxt;
      var currTask = state.currentTask

      if (groupId) action = { type: 'addTask' }
      if (action) activityTxt = `Edited ${action.type} in ${task.title}`
      else activityTxt = task._id ? `Edited task ${task.title}` : `${state.currentBoard.title}`
      if (action?.type === 'addTask') activityTxt = 'added task '

      if (state.currentGroup) groupId = state.currentGroup._id;

      if (groupId) {
        groupIdx = state.currentBoard.groups.findIndex(group => group._id === groupId);
      } else {
        groupIdx = state.currentBoard.groups.findIndex(group => {
          return (group.tasks.findIndex(t => t._id === task._id) !== -1)
        })
      }

      if (task._id) {
        const taskIdx = state.currentBoard.groups[groupIdx].tasks.findIndex(
          currTask => currTask._id === task._id
        );
        state.currentBoard.groups[groupIdx].tasks.splice(taskIdx, 1, task);
      } else {
        task._id = utilService.makeId();
        state.currentBoard.groups[groupIdx].tasks.push(task);
      }
      if (action?.type === 'members' && (currTask?.members?.length || currTask?.members?.length > task?.members?.length)) return

      const currGroup = state.currentBoard.groups[groupIdx];
      const userId = userService.getLoggedinUser()._id;
      const activity = boardService.addActivity(activityTxt, userId, currTask?._id, currGroup?._id, state.currentBoard._id)
      if (action?.type === 'members') activity.toMemberId = action.item._id;
      state.currentBoard.activities.unshift(activity);

      if (action?.type && (action.type === 'addTask' || action.type === 'members')) {
        socketService.emit('activity notify', { activity, boardMembers: state.currentBoard.members })
      }
    },
    removeTask(state, { task }) {
      const taskIdx = state.currentBoard.groups[task.groupIdx].tasks.findIndex(
        currTask => currTask._id === task.taskId
      );
      const { _id, title } = state.currentBoard.groups[task.groupIdx].tasks[taskIdx];
      state.currentBoard.groups[task.groupIdx].tasks.splice(taskIdx, 1);

      // const activity = boardService.addActivity('Removed task', userService.getLoggedinUser(), { type: 'task', _id, title })
      // state.currentBoard.activities.unshift(activity);
    },
  },
  actions: {
    async loadBoards({ commit, state }) {
      try {
        const boards = await boardService.getBoards(state.filterBy);
        commit({ type: 'setBoards', boards });
        socketService.off('board update')
        socketService.on('board update', board => {
          const user = userService.getLoggedinUser();
          if (board._id === state.currentBoard?._id) {
            commit({ type: 'setCurrentBoard', board });
          } else if (board.members.find(member => member._id === user._id)) {
            commit({ type: 'saveBoard', board });
          }
        })
      } catch (err) {
        console.log(err);
      }
    },
    async saveBoard({ getters, commit }, { board, activity }) {
      if (!board._id) {
        board.createdBy = getters.miniUser; // should come from server later
        board.members = [getters.miniUser]; // should come from server later
      }

      try {
        const boardCopy = JSON.parse(JSON.stringify(board))
        commit({ type: 'saveBoard', board: boardCopy });
        const savedBoard = await boardService.saveBoard(board);
        socketService.emit('set board', board);
        return savedBoard;
      } catch (err) {
        console.log(err);
      }
    },
    async removeBoard({ commit }, { boardId }) {
      try {
        await boardService.removeBoard(boardId);
        commit({ type: 'removeBoard', boardId });
      } catch (err) {
        console.log(err);
      }
    },
    async setCurrentBoard({ commit }, { boardId }) {
      try {
        const board = await boardService.getBoardById(boardId);
        commit({ type: 'setCurrentBoard', board });
      } catch (err) {
        console.log(err);
      }
    },
    async setBoardPrefs({ state, commit, dispatch }, { key, val }) {
      try {
        commit({ type: 'updateBoard', key, val });
        await dispatch({ type: 'saveBoard', board: state.currentBoard });
        if (key === 'members') {
          const user = userService.getLoggedinUser();
          const newMember = val[val.length - 1];
          // txt, byMemberId, taskId, groupId, boardId
          const activity = boardService.addActivity(state.currentBoard.title, user._id, null, null, state.currentBoard._id)
          activity.toMemberId = newMember._id;
          console.log(2);
          socketService.emit('activity notify', { activity, boardMembers: state.currentBoard.members })
        }
        // commit({ type: 'setCurrentBoard', board: savedBoard });
      } catch (err) {
        console.log(err);
      }
    },
    async addGroup({ state, commit, dispatch }, { groupTitle }) {
      try {
        const group = boardService.getEmptyGroup(groupTitle);
        console.log(group);
        commit({ type: 'addGroup', group });
        await dispatch({ type: 'saveBoard', board: state.currentBoard });
      } catch (err) {
        console.log(err);
      }
    },
    async setGroups({ state, commit, dispatch }, { groups }) {
      try {
        commit({ type: 'setCurrGroups', groups });
        await dispatch({ type: 'saveBoard', board: state.currentBoard });
      } catch (err) {
        console.log(err);
      }
    },
    async removeGroup({ state, commit, dispatch }, { groupId }) {
      try {
        commit({ type: 'removeGroup', groupId });
        await dispatch({ type: 'saveBoard', board: state.currentBoard });
      } catch (err) {
        console.log(err);
      }
    },
    async setGroup({ state, commit, dispatch }, { groupIdx, newGroup }) {
      try {
        commit({ type: 'setGroup', groupIdx, newGroup });
        await dispatch({ type: 'saveBoard', board: state.currentBoard });
      } catch (err) {
        console.log(err);
      }
    },
    async setTask({ commit, state, dispatch }, { groupId, task, action }) {
      try {
        commit({ type: 'setTask', groupId, task, action });
        await dispatch({ type: 'saveBoard', board: state.currentBoard });
      } catch (err) {
        console.log(err);
      }
    },
    async removeTask({ commit, state, dispatch }, { task }) {
      try {
        const groupIdx = state.currentBoard.groups.findIndex(group => group._id === task.groupId);
        commit({ type: 'removeTask', task: { groupIdx, taskId: task.taskId } });
        await dispatch({ type: 'saveBoard', board: state.currentBoard });
      } catch (err) {
        console.log(err);
      }
    }
  },
};
