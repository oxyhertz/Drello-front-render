import { httpService } from './http-service.js';
import { utilService } from './utils-service.js';

export const boardService = {
    getBoards,
    removeBoard,
    saveBoard,
    getBoardById,
    getEmptyBoard,
    getEmptyGroup,
    addActivity
}

function getBoards(filterBy) {
    var queryStr = '';
    return httpService.get(`board`);
}

function getBoardById(boardId) {
    if (boardId) return httpService.get(`board/${boardId}`);
}

function removeBoard(boardId) {
    return httpService.delete(`board/${boardId}`);
}

function saveBoard(board) {
    if (board._id) return httpService.put(`board/${board._id}`, board);
    return httpService.post(`board`, board);
}

function getEmptyGroup(title = '', tasks = []) {
    return {
        _id: utilService.makeId(),
        title,
        tasks,
    };
}

function addActivity(txt, byMemberId, taskId, groupId, boardId) {
    return {
        _id: utilService.makeId(),
        byMemberId,
        txt,
        taskId,
        groupId,
        boardId,
        createdAt: Date.now(),
        isReaden: false,
    }
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
                "color": "rgb(0, 121, 191)",
                "title": "Day",
                "_id": "l102"
            },
            {
                "color": "rgb(210, 144, 52)",
                "title": "Remarket",
                "_id": "l103"
            },
            {
                "color": "rgb(81, 152, 57)",
                "title": "Demand Marketing",
                "_id": "enT4D7oh"
            },
            {
                "color": "rgb(176, 70, 50)",
                "title": "Partners",
                "_id": "rtbnYyfi"
            },
            {
                "color": "rgb(137, 96, 158)",
                "title": "Government",
                "_id": "5leaLS2n"
            },
            {
                "color": "rgb(205, 90, 145)",
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
        activities: []
    });
}