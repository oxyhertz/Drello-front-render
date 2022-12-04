<template>
  <header class="main-header flex space-between" :class="{ 'header-bg-color': isBoard }">
    <div class="flex">
      <span class="menu-btn"></span>
      <section class="header-logo flex align-items" @click="home">
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="trello"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          class="trello-icon svg-inline--fa fa-trello fa-w-14 logo-img"
        >
          <path
            fill="currentColor"
            d="M392.3 32H56.1C25.1 32 0 57.1 0 88c-.1 0 0-4 0 336 0 30.9 25.1 56 56 56h336.2c30.8-.2 55.7-25.2 55.7-56V88c.1-30.8-24.8-55.8-55.6-56zM197 371.3c-.2 14.7-12.1 26.6-26.9 26.6H87.4c-14.8.1-26.9-11.8-27-26.6V117.1c0-14.8 12-26.9 26.9-26.9h82.9c14.8 0 26.9 12 26.9 26.9v254.2zm193.1-112c0 14.8-12 26.9-26.9 26.9h-81c-14.8 0-26.9-12-26.9-26.9V117.2c0-14.8 12-26.9 26.8-26.9h81.1c14.8 0 26.9 12 26.9 26.9v142.1z"
            class
          />
        </svg>
        <span class="logo">Drello</span>
      </section>

      <div class="create-board-container flex align-items">
        <button
          class="create-btn"
          @click="isCreateBoard = !isCreateBoard"
          :class="{ 'light-btn-bg': isBoard }"
        >
          <p>Create</p>
          <span class="icon-plus"></span>
        </button>
      </div>
      <createBoard @closeCreateModal="isCreateBoard = false" v-if="isCreateBoard"></createBoard>
      <div class="header-btn hidden-btn-header" title="Recent" @click="toggleRecentBoards">
        <span>Recent</span>
        <svg
          width="16"
          height="16"
          role="presentation"
          focusable="false"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.2929 16.7071L4.22185 9.63606C3.83132 9.24554 3.83132 8.61237 4.22185 8.22185C4.61237 7.83133 5.24554 7.83133 5.63606 8.22185L12 14.5858L18.364 8.22185C18.7545 7.83132 19.3877 7.83132 19.7782 8.22185C20.1687 8.61237 20.1687 9.24554 19.7782 9.63606L12.7071 16.7071C12.3166 17.0977 11.6834 17.0977 11.2929 16.7071Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <recent-boards-popup
        @closePopup="toggleRecentBoards"
        v-click-outside="toggleRecentBoards"
        v-if="isRecentBoards"
        :boards="boards"
        :user="user"
        class="popup"
      ></recent-boards-popup>
      <div class="header-btn hidden-btn-header" title="Starred" @click="toggleFavoriteBoards">
        <span>Starred</span>
        <svg
          width="16"
          height="16"
          role="presentation"
          focusable="false"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.2929 16.7071L4.22185 9.63606C3.83132 9.24554 3.83132 8.61237 4.22185 8.22185C4.61237 7.83133 5.24554 7.83133 5.63606 8.22185L12 14.5858L18.364 8.22185C18.7545 7.83132 19.3877 7.83132 19.7782 8.22185C20.1687 8.61237 20.1687 9.24554 19.7782 9.63606L12.7071 16.7071C12.3166 17.0977 11.6834 17.0977 11.2929 16.7071Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div class="header-btn more-btn" @click="toggleMoreModal">
        <span>More</span>
        <svg
          width="16"
          height="16"
          role="presentation"
          focusable="false"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.2929 16.7071L4.22185 9.63606C3.83132 9.24554 3.83132 8.61237 4.22185 8.22185C4.61237 7.83133 5.24554 7.83133 5.63606 8.22185L12 14.5858L18.364 8.22185C18.7545 7.83132 19.3877 7.83132 19.7782 8.22185C20.1687 8.61237 20.1687 9.24554 19.7782 9.63606L12.7071 16.7071C12.3166 17.0977 11.6834 17.0977 11.2929 16.7071Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <more-popup
        v-if="isMoreModal"
        @closeMoreModal="toggleMoreModal"
        @openRecent="toggleRecentBoards"
        @openStarred="toggleFavoriteBoards"
      ></more-popup>
      <favorite-boards-popup
        @closePopup="toggleFavoriteBoards"
        v-click-outside="toggleFavoriteBoards"
        v-if="isFavoriteBoards"
        :user="user"
        class="popup"
      ></favorite-boards-popup>
    </div>

    <section class="secondery-container flex align-items">
      <!-- <button v-if="user" @click="logout">LOGOUT</button> -->
      <div class="main-header-input flex" :class="{ focused: isInputFocused }" @click="focusInput">
        <span class="icon-search flex"></span>
        <input
          v-model="filterBy.title"
          @blur="isInputFocused = false;"
          ref="headerInput"
          placeholder="Search boards..."
          @click="focusInput"
        />
        <board-search v-click-outside="toggleBoardSearch" v-if="isBoardSearch" :filterBy="filterBy"></board-search>
      </div>
      <div
        v-if="user"
        class="notification-btn"
        @click="toggleNotificationsModal"
        :class="{ 'red-bg': isReaden }"
      >
        <span class="icon icon-bell"></span>
      </div>
      <Transition>
        <user-notification
          @closeModal="toggleNotificationsModal"
          v-click-outside="toggleNotificationsModal"
          v-if="isNotificationModal"
          class="popup"
        ></user-notification>
      </Transition>
      <!-- <i class="fa-regular fa-bell notification-header"></i> -->
      <div class="user">
        <avatar
          @click="toggleUserModal"
          v-if="user"
          size="32"
          color="white"
          :name="user.fullname"
          class="avatar-header"
        ></avatar>
        <user-modal
          v-click-outside="toggleUserModal"
          :user="user"
          @closeModal="toggleUserModal"
          v-if="isUserModal"
        ></user-modal>
      </div>
    </section>
  </header>
</template>


<script>
import { Search } from '@element-plus/icons-vue';
import createBoard from './create-board.vue';
import Avatar from 'vue3-avatar';
import userModal from './board-header/user-modal.vue';
import boardSearch from './board-search.vue'
import recentBoardsPopup from './recent-boards-popup.vue'
import favoriteBoardsPopup from './favorite-boards-popup.vue';
import morePopup from './more-popup.vue';
import userNotification from './user-notification.vue';
export default {
  created() {
  },
  data() {
    return {
      search: '',
      isCreateBoard: false,
      isInputFocused: false,
      Search,
      isUserModal: false,
      isBoardSearch: false,
      isRecentBoards: false,
      isFavoriteBoards: false,
      isMoreModal: false,
      isNotificationModal: false,
      filterBy: {
        title: ''
      }
    };
  },
  async created() {
    // await this.$store.dispatch({ type: 'loadBoards' })
  },
  methods: {
    home() {
      this.$router.push('/board');
    },
    focusInput() {
      this.$refs.headerInput.focus();
      this.isInputFocused = true;
      this.toggleBoardSearch();
    },
    async logout() {
      await this.$store.dispatch({ type: 'logout' });
      this.$router.push('/login');
    },
    toggleUserModal() {
      this.isUserModal = !this.isUserModal
    },
    toggleBoardSearch() {
      this.isBoardSearch = !this.isBoardSearch
    },
    toggleRecentBoards() {
      this.isRecentBoards = !this.isRecentBoards
    },
    toggleFavoriteBoards() {
      this.isFavoriteBoards = !this.isFavoriteBoards
    },
    toggleMoreModal() {
      this.isMoreModal = !this.isMoreModal
    },
    toggleNotificationsModal() {
      this.isNotificationModal = !this.isNotificationModal
    },
    toggleModal(val) {
      console.log(val)
      this[val] = !this[val]
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    isBoard() {
      return this.$store.getters.currBoard
    },
    boards() {
      return this.$store.getters.boards
    },
    isReaden() {
      console.log(this.$store.getters?.user)
      return this.$store.getters?.user?.activities.some(activity => !activity.isReaden)
    }


  },
  components: {
    createBoard,
    Avatar,
    userModal,
    boardSearch,
    recentBoardsPopup,
    favoriteBoardsPopup,
    morePopup,
    userNotification
  },
};
</script>

<style>
.main-input {
  cursor: pointer;
  height: 32px;
  border-radius: 3px;
  padding: 6px;
  border: none;
  box-shadow: inset 0 0 0 2px #dfe1e6;
  flex: 1;
  max-width: 200px;
  color: #172b4d;
  outline: 0;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
