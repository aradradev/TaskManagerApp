"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = void 0;
//src/main.ts
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
    //Save file implementation
    saveTasksToFile() {
        const tasksJson = JSON.stringify(this.tasks, null, 2);
        const defaultFileName = 'tasks-manager.json';
        const folderPath = 'DATABASE';
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
        const filePath = path.join(folderPath, defaultFileName);
        fs.writeFileSync(filePath, tasksJson);
        console.log(`Tasks saved to ${filePath}.`);
    }
    //Load file implementation
    loadTasksFromFile() {
        const defaultFileName = 'tasks-manager.json';
        const folderPath = 'DATABASE';
        const filePath = path.join(folderPath, defaultFileName);
        try {
            const tasksJson = fs.readFileSync(filePath, 'utf-8');
            const loadedTasks = JSON.parse(tasksJson);
            if (Array.isArray(loadedTasks)) {
                this.tasks = loadedTasks;
                console.log(`Tasks loaded from ${filePath}.`);
            }
            else {
                console.error('Invalid file format. Unable to load tasks.');
            }
        }
        catch (error) {
            console.error(`Error loading tasks from ${filePath}: ${error.message}`);
        }
    }
}
exports.TaskManager = TaskManager;
