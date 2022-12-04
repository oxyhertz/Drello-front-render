// import { utilService } from './utils-service.js';
// import { storageService } from './storage-service.js';

// const USER_KEY = 'userDB';
// _createUsers();

// export const userManageService = {
//   query,
//   remove,
//   save,
//   get,
//   getGuestUser,
// };

// function query() {
//   return storageService.query(USER_KEY);
// }

// function remove(userId) {
//   return storageService.remove(USER_KEY, userId);
// }

// function get(userId) {
//   return storageService.get(USER_KEY, userId);
// }

// function save(user) {
//   if (user.id) return storageService.put(USER_KEY, user);
//   else return storageService.post(USER_KEY, user);
// }

// function getGuestUser() {
//   return {
//     fullname: 'Guest User',
//     username: 'guest',
//     password: 'guest',
//     isAdmin: true,
//   };
// }

// function _createUsers() {
//   let users = utilService.loadFromStorage(USER_KEY);
//   if (!users || !users.length) {
//     users = [
//       {
//         _id: 'u101',
//         fullname: 'Dima Pol',
//         username: 'abi@ababmi.com',
//         password: 'dima',
//         imgUrl: 'http://some-img.jpg',
//         mentions: [
//           {
//             id: 'm101',
//             boardId: 'm101',
//             taskId: 't101',
//           },
//         ],
//       },
//       {
//         _id: 'hgfd43 ',
//         fullname: 'Guest',
//         username: 'Guest',
//         password: 'guest',
//         imgUrl: 'http://some-img.jpg',
//         mentions: [
//           {
//             id: 'm101',
//             boardId: 'm101',
//             taskId: 't101',
//           },
//         ],
//       },
//     ];
//     utilService.saveToStorage(USER_KEY, users);
//   }
//   return users;
// }
