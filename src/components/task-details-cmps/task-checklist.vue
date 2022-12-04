<template>
    <section class="task-checklist" v-if="checklist">
        <header>
            <section class="block-title">
                <span class="icon checklist-icon"></span>
            </section>

            <section class="checklist-header-container">
                <input
                    type="text"
                    class="checklist-title-input"
                    @blur="updateTask"
                    v-model="checklistToEdit.title"
                />

                <section class="header-actions flex">
                    <button
                        v-if="isAnyTodoDone"
                        @click="isHideDone = !isHideDone"
                        class="hide-show-btn"
                    >{{ hideBtnTxt }}</button>
                    <button @click="deleteChecklist">Delete</button>
                </section>
            </section>
        </header>

        <div class="progress-bar">
            <span class="percentage">{{ doneTodosPerecent }}%</span>
            <progress :value="doneTodosPerecent" max="100"></progress>
        </div>

        <div class="todos-container">
            <div v-for="todo in checklistToEdit.todos" :key="todo._id">
                <div class="todo-container" v-if="isHideDone ? !todo.isDone : true">
                    <input type="checkbox" v-model="todo.isDone" @change="updateTask" />
                    <textarea
                        spellcheck="false"
                        :class="{ completed: todo.isDone }"
                        @blur="updateTask"
                        v-model="todo.title"
                        rows="1"
                    ></textarea>
                </div>
            </div>
        </div>

        <button v-if="!addItemMode" @click="addItemMode = true" class="add-todo-btn">Add an item</button>
        <section v-else>
            <textarea v-model="newTodoTitle" v-focus placeholder="Add an item" class="add-todo-inp"></textarea>
            <section class="actions">
                <button class="blue-btn" @click="addTodo">Add</button>
                <i @click="addItemMode = false" class="fa-solid fa-x"></i>
            </section>
        </section>
    </section>
</template>

<script>
import { utilService } from '../../services/utils-service';

export default {
    name: 'task-checklist',
    props: {
        checklist: Object
    },
    data() {
        return {
            checklistToEdit: null,
            newTodoTitle: '',
            addItemMode: false,
            isHideDone: false,
        }
    },
    created() {
        this.checklistToEdit = JSON.parse(JSON.stringify(this.checklist));
    },
    methods: {
        addTodo() {
            if (!this.newTodoTitle) return;

            const todo = {
                _id: utilService.makeId(),
                title: this.newTodoTitle,
                isDone: false
            }
            this.checklistToEdit.todos.push(todo);
            this.newTodoTitle = '';
            this.addItemMode = false;
            this.updateTask();
        },
        deleteChecklist() {
            this.$emit('updateItem', { type: 'checklists', val: { _id: this.checklistToEdit._id } });
        },
        updateTask() {
            this.$emit('updateItem', { type: 'checklists', val: JSON.parse(JSON.stringify(this.checklistToEdit)) });
        }
    },
    computed: {
        doneTodosPerecent() {
            const numOfTodos = this.checklistToEdit.todos.length;
            if (!numOfTodos) return 0;
            const numOfDoneTodos = this.checklistToEdit.todos.reduce((acc, todo) => todo.isDone ? acc + 1 : acc, 0);
            return parseInt(numOfDoneTodos / numOfTodos * 100);
        },
        isAnyTodoDone() {
            return this.checklistToEdit.todos.some(todo => todo.isDone);
        },
        hideBtnTxt() {
            if (!this.isHideDone) return 'Hide checked items';
            const numOfDoneTodos = this.checklistToEdit.todos.reduce((acc, todo) => todo.isDone ? acc + 1 : acc, 0);
            return `Show checked items (${numOfDoneTodos})`;
        }
    }
}
</script>
