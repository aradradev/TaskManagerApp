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
}
exports.TaskManager = TaskManager;
