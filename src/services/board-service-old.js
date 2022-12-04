import { utilService } from './utils-service.js';
import { storageService } from './storage-service.js';

const BOARD_KEY = 'boardDB';
_createBoards();

export const boardService = {
  getBoards, //
  removeBoard, //
  saveBoard, //
  getBoardById, //
  setBoardPrefs, // update
  getEmptyBoard, //
  getGroups,
  getGroupById,
  removeGroup, //
  getEmptyGroup,
  getTasks,
  getTaskById,
  removeTask,
};

function getBoards(filterBy) {
  return storageService.query(BOARD_KEY);
}

function removeBoard(boardId) {
  return storageService.remove(BOARD_KEY, boardId);
}

function getBoardById(boardId) {
  return storageService.get(BOARD_KEY, boardId);
}

function saveBoard(board) {
  if (board._id) return storageService.put(BOARD_KEY, board);
  else return storageService.post(BOARD_KEY, board);
}

function setBoardPrefs(boardId, key, val) {
  return getBoardById(boardId).then(board => {
    board[key] = val;
    return board;
  });
}

function getGroups(boardId) {
  return getBoardById(boardId).then(board => board.groups);
}

function removeGroup(currBoard, groupId) {
  const idx = currBoard.groups.findIndex(group => group._id === groupId);
  currBoard.groups.splice(idx, 1);
  return Promise.resolve(currBoard);
}

function getGroupById(currBoard, groupId) {
  return Promise.resolve(currBoard.find(group => group._id === groupId));
}

function getTasks(currBoard, groupId) {
  return getGroupById(currBoard, groupId).then(group => group.tasks);
}

function getTaskById(currBoard, groupId, taskId) {
  return getTasks(currBoard, groupId).then(tasks =>
    tasks.find(task => task._id === taskId)
  );
}

function removeTask(currGroup, taskId) {
  const idx = currGroup.findIndex(task => task._id === taskId);
  currGroup.tasks.splice(idx, 1);
  return currGroup;
}

function getEmptyGroup(title = '', tasks = []) {
  return {
    _id: utilService.makeId(),
    title,
    tasks,
  };
}

function getEmptyBoard() {
  return Promise.resolve({
    title: '',
    isFavorite: false,
    createdBy: '',
    style: {
      bgColor: '#cacabb',
    },
    labels: [
      {
        "color": "#f5dd29",
        "title": "Day",
        "_id": "l102"
      },
      {
        "color": "#a7ffeb",
        "title": "Remarket",
        "_id": "l103"
      },
      {
        "color": "#d7aefb",
        "title": "Demand Marketing",
        "_id": "enT4D7oh"
      },
      {
        "color": "#33a9bb",
        "title": "Partners",
        "_id": "rtbnYyfi"
      },
      {
        "color": "#16243d",
        "title": "Government",
        "_id": "5leaLS2n"
      },
      {
        "color": "#f28b82",
        "title": "Planning",
        "_id": "NuwdhQ9L"
      }
    ],
    members: [],
    groups: [
      {
        _id: utilService.makeId(),
        title: 'New List',
        tasks: [],
      },
    ],
  });
}

function _createBoards() {
  let boards = utilService.loadFromStorage(BOARD_KEY);
  if (!boards || !boards.length) {
    boards = [
      {
        _id: 'b101',
        title: 'trello copy project',
        createdAt: 1589983468418,
        isFavorite: false,
        createdBy: {
          _id: 'u101',
          fullname: 'Abi Abambi',
          imgUrl: 'http://some-img',
        },
        style: {
          bgColor: '#26de81',
          bgImg:
            'https://images.unsplash.com/photo-1647735282508-1ad1d771f9be?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
        },
        labels: [
          {
            _id: 'l101',
            title: 'Done',
            color: '#61bd4f',
          },
          {
            _id: 'l102',
            title: 'Progress',
            color: '#61bd33',
          },
        ],
        members: [
          {
            _id: 'u101',
            fullname: 'Tal Tarablus',
            imgUrl: 'https://www.google.com',
          },
        ],
        groups: [
          {
            _id: 'g101',
            title: 'Group 1',
            tasks: [
              {
                _id: 'c101',
                title: 'Replace logo',
              },
              {
                _id: 'c102',
                title: 'Add Samples',
              },
            ],
            style: {},
          },
          {
            _id: 'g102',
            title: 'Group 2',
            tasks: [
              // CARD
              {
                _id: 'c103',
                title: 'Do that',
              },
              {
                _id: 'c104',
                title: 'Help me',
                status: 'in-progress',
                description: 'description',
                comments: [
                  {
                    _id: 'ZdPnm',
                    txt: 'also @yaronb please CR this',
                    createdAt: 1590999817436.0,
                    byMember: {
                      _id: 'u101',
                      fullname: 'Tal Tarablus',
                      imgUrl:
                        'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
                    },
                  },
                ],
                checklists: [
                  {
                    _id: 'YEhmF',
                    title: 'Checklist',
                    todos: [
                      {
                        _id: '212jX',
                        title: 'To Do 1',
                        isDone: false,
                      },
                    ],
                  },
                ],
                members: [
                  {
                    _id: 'u101',
                    username: 'Tal',
                    fullname: 'Tal Tarablus',
                    imgUrl:
                      'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
                  },
                ],
                labelIds: ['l101', 'l102'],
                createdAt: 1590999730348,
                dueDate: 16156215211,
                byMember: {
                  _id: 'u101',
                  username: 'Tal',
                  fullname: 'Tal Tarablus',
                  imgUrl:
                    'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
                },
                style: {
                  bgColor: '#26de81',
                },
              },
            ],
            style: {},
          },
        ],
        activities: [
          {
            _id: 'a101',
            txt: 'Changed Color',
            createdAt: 154514,
            byMember: {
              _id: 'u101',
              fullname: 'Abi Abambi',
              imgUrl: 'http://some-img',
            },
            task: {
              _id: 'c101',
              title: 'Replace Logo',
            },
          },
        ],
      },
      {
        _id: 'b132',
        title: 'Trello sprint proj',
        createdAt: 1589923468418,
        isFavorite: true,
        createdBy: {
          _id: 'u101',
          fullname: 'Admin  ',
          imgUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        },
        style: {
          bgColor: '#fafaf2',
        },
        labels: [
          {
            _id: 'l101',
            title: 'Done',
            color: '#61bd4f',
          },
          {
            _id: 'l102',
            title: 'Progress',
            color: '#61bd33',
          },
          {
            _id: 'l103',
            title: 'ASAP',
            color: '#f0f0f0',
          },
        ],
        members: [
          {
            _id: 'u101',
            fullname: 'Dima Pol',
            imgUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
          },
          {
            _id: 'u102',
            fullname: 'Admin  ',
            imgUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
          },
        ],
        groups: [
          {
            _id: 'g121',
            title: 'Group 1',
            tasks: [
              {
                _id: 'c121',
                title: 'Change header color',
              },
              {
                _id: 'c122',
                title: 'Add task input',
              },
              {
                _id: 'c123e',
                title: 'Change bg color',
              },
            ],
            style: {},
          },
          {
            _id: '21a321gad',
            title: 'Go to production',
            tasks: [
              {
                _id: 'c1233',
                title: 'Upload patch',
              },
              {
                _id: 'c123104',
                title: 'Help me',
                status: 'in-progress',
                description: 'description',
                comments: [
                  {
                    _id: 'ZdPnm',
                    txt: 'also @yaronb please CR this',
                    createdAt: 1590999780000,
                    byMember: {
                      _id: 'u101',
                      fullname: 'Dima pol',
                      imgUrl:
                        'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
                    },
                  },
                ],
                checklists: [
                  {
                    _id: 'YEh2mF',
                    title: 'Checklist',
                    todos: [
                      {
                        _id: '212jX',
                        title: 'To Do 1',
                        isDone: false,
                      },
                    ],
                  },
                ],
                members: [
                  {
                    _id: 'u101',
                    username: 'Tal',
                    fullname: 'Tal Tarablus',
                    imgUrl:
                      'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
                  },
                ],
                labelIds: ['l101', 'l102'],
                createdAt: 1590999730348,
                dueDate: 17156215211,
                byMember: {
                  _id: 'u101',
                  username: 'Tal',
                  fullname: 'Tal Tarablus',
                  imgUrl:
                    'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
                },
                style: {
                  bgColor: '#26de81',
                },
              },
            ],
            style: {},
          },
        ],
        activities: [
          {
            _id: 'a101',
            txt: 'Changed Color',
            createdAt: 154514,
            byMember: {
              _id: 'u101',
              fullname: 'Abi Abambi',
              imgUrl: 'http://some-img',
            },
            task: {
              _id: 'c101',
              title: 'Replace Logo',
            },
          },
        ],
      },
      {
        "title": "Agile Board",
        "isFavorite": false,
        "createdBy": {
          "_id": "hgfd43",
          "fullname": "Guest",
          "username": "Guest",
          "imgUrl": "http://some-img.jpg"
        },
        "style": {
          "bgColor": "#16243d",
          "bgImg": "https://trello-backgrounds.s3.amazonaws.com/53baf533e697a982248cd73f/2048x2048/22ec03aab9d36ea49139c569a62bb079/shutterstock_134707556.jpg"
        },
        "labels": [
          {
            "color": "#69c494",
            "title": "Marketing",
            "_id": "l101"
          },
          {
            "color": "#f5dd29",
            "title": "Day",
            "_id": "l102"
          },
          {
            "color": "#a7ffeb",
            "title": "Remarket",
            "_id": "l103"
          },
          {
            "color": "#d7aefb",
            "title": "Demand Marketing",
            "_id": "enT4D7oh"
          },
          {
            "color": "#33a9bb",
            "title": "Partners",
            "_id": "rtbnYyfi"
          },
          {
            "color": "#16243d",
            "title": "Government",
            "_id": "5leaLS2n"
          },
          {
            "color": "#f5dd29",
            "title": "Happiness",
            "_id": "Ov8fHXgC"
          },
          {
            "color": "#f28b82",
            "title": "Planning",
            "_id": "NuwdhQ9L"
          }
        ],
        "members": [
          {
            "_id": "hgfd43",
            "fullname": "Guest",
            "username": "Guest",
            "imgUrl": "http://some-img.jpg"
          }
        ],
        "groups": [
          {
            "_id": "paB40SEe",
            "title": "New List",
            "tasks": [
              {
                "title": "Review Tech partner pages",
                "_id": "0FxxHKAs",
                "labelIds": [
                  "enT4D7oh"
                ]
              },
              {
                "title": "Make sure sponsors are indicated for Tech Talk",
                "_id": "WQHsG4uW"
              },
              {
                "title": "Top 10 Trends list - Forbes",
                "_id": "Yd7j0Gmf",
                "labelIds": [
                  "l101"
                ]
              },
              {
                "title": "TBC Webinar: Ship Now, Not Later",
                "_id": "zzxS8uBw"
              },
              {
                "title": "1:1 Nancy",
                "_id": "m7CXVrWr",
                "labelIds": [
                  "Ov8fHXgC"
                ]
              },
              {
                "title": "Lead Gen Mandrill stats",
                "_id": "O6RZbxBy"
              }
            ]
          },
          {
            "_id": "OhJF8vYh",
            "title": "Current Sprint",
            "tasks": [
              {
                "title": "Going live with server deployment",
                "_id": "VjmvaLnb",
                "labelIds": [
                  "5leaLS2n",
                  "NuwdhQ9L"
                ]
              },
              {
                "title": "Google Adwords list of referrers",
                "_id": "uVKDKGv9"
              },
              {
                "title": "IT Solutions page",
                "_id": "uiyp0cb2",
                "cover": {
                  "color": "#cfd3da",
                  "imgUrl": "http://res.cloudinary.com/dkqvblbeq/image/upload/v1648325822/t8x80q9gw3xwvhbc4hwm.jpg",
                  "type": "inline"
                }
              },
              {
                "title": "Email campaign - February",
                "_id": "YVZl9xv6",
                "labelIds": [
                  "enT4D7oh"
                ],
                "dueDate": null,
                "status": ""
              }
            ]
          },
          {
            "_id": "z0HKStVH",
            "title": "In Progress",
            "tasks": [
              {
                "title": "Android App new landing page",
                "_id": "AqyE5mbf",
                "labelIds": [
                  "l103"
                ]
              },
              {
                "title": "Analytics",
                "_id": "O57uo4Jt"
              },
              {
                "title": "Branding guidelines",
                "_id": "rwNQwvaU",
                "labelIds": [
                  "l103",
                  "rtbnYyfi"
                ]
              }
            ]
          },
          {
            "_id": "vZyBcVPe",
            "title": "On Hold",
            "tasks": [
              {
                "title": "CSS Rules",
                "_id": "FjYD7cxM",
                "labelIds": [
                  "rtbnYyfi"
                ]
              },
              {
                "title": "Retail order",
                "_id": "Uz84tH03",
                "labelIds": [
                  "Ov8fHXgC"
                ]
              },
              {
                "title": "Mobile UI reboot",
                "_id": "ea3Po4df"
              },
              {
                "title": "Google Analytics data - Q1",
                "_id": "i8xDe3dc",
                "attachments": [
                  {
                    "createdAt": 1648326140162,
                    "fileName": "xczxcxzczxc.jpg",
                    "url": "http://res.cloudinary.com/dkqvblbeq/image/upload/v1648326140/zm3azlhpieilcblopguc.jpg",
                    "type": "image",
                    "id": "nIOqpmcw"
                  }
                ],
                "cover": {
                  "color": "#cfd3da",
                  "imgUrl": "http://res.cloudinary.com/dkqvblbeq/image/upload/v1648326162/z1fvjx1esgvhwolcx1le.jpg",
                  "type": "header"
                }
              }
            ]
          },
          {
            "_id": "6CLYJd1y",
            "title": "Next-up",
            "tasks": [
              {
                "title": "Data Analytics podcast",
                "_id": "ajTN1J6t"
              },
              {
                "title": "PR Firm outreach",
                "_id": "oA5G3NVg"
              },
              {
                "title": "List of vendors for banquets",
                "_id": "gdVp3i96"
              },
              {
                "title": "Google Adwords best practices",
                "_id": "npjrYlGb"
              }
            ]
          },
          {
            "_id": "KRbN2LyV",
            "title": "Questions",
            "tasks": [
              {
                "title": "How do you adjust the canvas size in Illustrator?",
                "_id": "hrvYFE49"
              },
              {
                "title": "Does Screenhero have a trial period?",
                "_id": "M5eXQvUN"
              },
              {
                "title": "When does the new subway fare hike increase - before or after remote week?",
                "_id": "u75sZDUF"
              }
            ]
          },
          {
            "_id": "wOqIU2Ll",
            "title": "Marketing Ideas - Icebox",
            "tasks": []
          },
          {
            "_id": "DiOwP7Rn",
            "title": "Junk Drawer",
            "tasks": []
          },
          {
            "_id": "x4nqh0Bz",
            "title": "Room for Improvement",
            "tasks": []
          }
        ],
        "createdAt": 1648325388959,
        "_id": "vX7sM2MI"
      },
      {
        "title": "Company Overview",
        "isFavorite": false,
        "createdBy": {
          "_id": "hgfd43",
          "fullname": "Guest",
          "username": "Guest",
          "imgUrl": "http://some-img.jpg"
        },
        "style": {
          "bgColor": "#f28b82",
          "bgImg": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=srgb&fm=jpg&ixid=MnwzMTM3NDl8MHwxfHNlYXJjaHwyfHxtb3VudGFpbnN8ZW58MHx8fHwxNjQ4MzIzMzE5&ixlib=rb-1.2.1&q=85"
        },
        "labels": [
          {
            "_id": "l101",
            "title": "Done",
            "color": "#61bd4f"
          },
          {
            "_id": "l102",
            "title": "Progress",
            "color": "#61bd33"
          },
          {
            "_id": "l103",
            "title": "ASAP",
            "color": "#f0f0f0"
          },
          {
            "color": "#bdea8a",
            "title": "Product",
            "_id": "T0RIbnSa"
          },
          {
            "color": "#16243d",
            "title": "IT",
            "_id": "mCV0oYuJ"
          }
        ],
        "members": [
          {
            "_id": "hgfd43",
            "fullname": "Guest",
            "username": "Guest",
            "imgUrl": "http://some-img.jpg"
          }
        ],
        "groups": [
          {
            "_id": "KQVsI8AI",
            "title": "New List",
            "tasks": [
              {
                "title": "product",
                "_id": "jAAX0HeX",
                "labelIds": [
                  "T0RIbnSa"
                ],
                "description": "Make product idea",
                "checklists": [
                  {
                    "_id": "vX0J7aCj",
                    "title": "hey",
                    "todos": [
                      {
                        "_id": "iqBPEIby",
                        "title": "Think of name",
                        "isDone": true
                      }
                    ]
                  }
                ]
              },
              {
                "title": "Support",
                "_id": "0o4RhTR2",
                "description": "Support guidlines",
                "labelIds": [
                  "l102"
                ],
                "attachments": [
                  {
                    "createdAt": 1648325600724,
                    "fileName": "pacman.png",
                    "url": "http://res.cloudinary.com/dkqvblbeq/image/upload/v1648325600/ptlowcyuu9ocaacsl5zb.png",
                    "type": "image",
                    "id": "gcEZw1us"
                  }
                ],
                "cover": {
                  "color": "#bdea8a",
                  "imgUrl": "",
                  "type": "header"
                }
              }
            ]
          },
          {
            "_id": "kvzydn8i",
            "title": "Analytics Data",
            "tasks": [
              {
                "title": "Engine Block\n",
                "_id": "pU08F6sb",
                "cover": {
                  "color": "#cfd3da",
                  "imgUrl": "https://images.unsplash.com/photo-1606337321936-02d1b1a4d5ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTM3NDl8MHwxfHNlYXJjaHwzfHxlbmdpbmV8ZW58MHx8fHwxNjQ4MzI1NjU1&ixlib=rb-1.2.1&q=80&w=400",
                  "type": "inline"
                },
                "members": [
                  {
                    "fullname": "Guest",
                    "username": "Guest",
                    "imgUrl": "http://some-img.jpg",
                    "_id": "hgfd43"
                  }
                ]
              },
              {
                "title": "IO proj\n",
                "_id": "Kamha0JE",
                "dueDate": 1648757700000,
                "status": "completed"
              },
              {
                "title": "IT\n",
                "_id": "VtHe1O1Z",
                "labelIds": [
                  "mCV0oYuJ"
                ],
                "checklists": [
                  {
                    "_id": "7R9aScUl",
                    "title": "Make con",
                    "todos": [
                      {
                        "_id": "ifzDmAbf",
                        "title": "Con offwhite jar",
                        "isDone": false
                      }
                    ]
                  },
                  {
                    "_id": "87CYqjuw",
                    "title": "Go on sale",
                    "todos": [
                      {
                        "_id": "CEgoNlQy",
                        "title": "10 products sale",
                        "isDone": true
                      },
                      {
                        "_id": "GIJz9EeE",
                        "title": "update marketing ",
                        "isDone": false
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "_id": "ZbtsH58a",
            "title": "Website redesign",
            "tasks": [
              {
                "title": "Redesign\n",
                "_id": "v0qFtHvL",
                "description": "Our brand & product have evolved over the past two years, and our website should be updated to reflect this. The new site will be mobile-first, responsive and lightweight.\nHipChat Room- Website Redesign\nTrello Board- https://trello.com/c/jVBrN8VQ/22-website-redesign\nProject Manager- ChrisOur brand & product have evolved over the past two years, and our website should be updated to reflect this. The new site will be mobile-first, responsive and lightweight.\nHipChat Room- Website Redesign\nTrello Board- https://trello.com/c/jVBrN8VQ/22-website-redesign\nProject Manager- Chris",
                "cover": {
                  "color": "#f28b82",
                  "imgUrl": "",
                  "type": "inline"
                }
              },
              {
                "title": "update UI\n",
                "_id": "llttcYfw",
                "labelIds": [
                  "l102"
                ],
                "members": [
                  {
                    "fullname": "Guest",
                    "username": "Guest",
                    "imgUrl": "http://some-img.jpg",
                    "_id": "hgfd43"
                  }
                ],
                "dueDate": 1647465540000,
                "status": "completed"
              },
              {
                "title": "Check web flow",
                "_id": "KzXxEOAC",
                "attachments": [
                  {
                    "createdAt": 1648326022135,
                    "fileName": "pacman.png",
                    "url": "http://res.cloudinary.com/dkqvblbeq/image/upload/v1648326021/lwind7uqj56rcuvh3bgg.png",
                    "type": "image",
                    "id": "o9v8z8vx"
                  }
                ]
              }
            ]
          },
          {
            "_id": "DXIptTtk",
            "title": "Mind stream",
            "tasks": [
              {
                "title": "✋🏿 Move anything from doing to done here",
                "_id": "g9fdQLO7",
                "attachments": [
                  {
                    "createdAt": 1648326170623,
                    "fileName": "pacman.png",
                    "url": "http://res.cloudinary.com/dkqvblbeq/image/upload/v1648326170/cz425m9hjbhaibyn4st7.png",
                    "type": "image",
                    "id": "00ESuYtj"
                  }
                ],
                "labelIds": [
                  "l103"
                ],
                "description": ""
              }
            ]
          },
          {
            "_id": "FJ1U9mFO",
            "title": "Brainstorm 🙌",
            "tasks": [
              {
                "title": "Brain mind",
                "_id": "hNcdZSUZ",
                "cover": {
                  "color": "#cfd3da",
                  "imgUrl": "https://images.unsplash.com/photo-1647185255973-04c8abf23d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTM3NDl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDgzMjYyNTU&ixlib=rb-1.2.1&q=80&w=400",
                  "type": "header"
                },
                "checklists": [
                  {
                    "_id": "w14otXcw",
                    "title": "Take",
                    "todos": [
                      {
                        "_id": "le65W931",
                        "title": "Down of Him",
                        "isDone": false
                      },
                      {
                        "_id": "o6PN8Tza",
                        "title": "Charge energy",
                        "isDone": false
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        "createdAt": 1648325474731,
        "_id": "vVi7QruP"
      }

    ];
    utilService.saveToStorage(BOARD_KEY, boards);
  }
  return boards;
}
