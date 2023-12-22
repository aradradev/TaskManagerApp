"use strict";
//src/main.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = void 0;
class TaskManager {
    constructor() {
        this.tasks = [];
    }
    addTask(task) {
        this.tasks.push(task);
    }
    editTask(taskId, updatedTask) {
        const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = Object.assign(Object.assign({}, this.tasks[taskIndex]), updatedTask);
        }
    }
    deleteTask(taskId) {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
    }
    getTasks() {
        return this.tasks;
    }
    //Adding new feature like sortTaskBy
    sortTasksBy(criteria) {
        switch (criteria) {
            case "priority":
                this.tasks.sort((a, b) => a.priority.localeCompare(b.priority));
                break;
            case "dueDate":
                this.tasks.sort((a, b) => (a.dueDate || new Date(0)).getTime() - (b.dueDate || new Date(0)).getTime());
                break;
            case "completed":
                this.tasks.sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1);
                break;
            default:
                console.log('Invalid sorting criterion.');
        }
    }
}
exports.TaskManager = TaskManager;
