"use strict";
//src/main.ts
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
    getTask() {
        return this.tasks;
    }
}
const exampleTask = {
    id: 1,
    title: 'Sample Title',
    priority: 'medium',
    dueDate: new Date('2023-12-31'),
    completed: false,
};
const taskManager = new TaskManager();
taskManager.addTask(exampleTask);
taskManager.editTask(1, { completed: true });
console.log(taskManager.getTask());
taskManager.deleteTask(1);
// console.log(taskManager.getTask())
