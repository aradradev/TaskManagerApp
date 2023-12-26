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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = void 0;
//src/main.ts
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const notifier = __importStar(require("node-notifier"));
class TaskManager {
    constructor() {
        this.tasks = [];
        this.undoStack = [];
        this.redoStack = [];
    }
    addTask(task) {
        this.pushToUndoStack();
        this.tasks.push(task);
        this.pushToRedoStack();
    }
    editTask(taskId, updatedTask) {
        this.pushToUndoStack();
        const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = Object.assign(Object.assign({}, this.tasks[taskIndex]), updatedTask);
        }
        this.pushToRedoStack();
    }
    deleteTask(taskId) {
        this.pushToUndoStack();
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.pushToRedoStack();
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
                console.log(chalk_1.default.red('Invalid sorting criterion.'));
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
        console.log(`${chalk_1.default.green(`Tasks saved to ${filePath}.`)}`);
    }
    //Load file implementation from JSON
    loadTasksFromFile() {
        const defaultFileName = 'tasks-manager.json';
        const folderPath = 'DATABASE';
        const filePath = path.join(folderPath, defaultFileName);
        try {
            const tasksJson = fs.readFileSync(filePath, 'utf-8');
            const loadedTasks = JSON.parse(tasksJson);
            if (Array.isArray(loadedTasks)) {
                this.tasks = loadedTasks;
                console.log(`${chalk_1.default.green(`Tasks loaded from ${filePath}.`)}`);
            }
            else {
                console.error(chalk_1.default.red('Invalid file format. Unable to load tasks.'));
            }
        }
        catch (error) {
            console.error(`${chalk_1.default.red(`Error loading tasks from ${filePath}: ${error.message}`)}`);
        }
    }
    //add new method to get current state
    getCurrentState() {
        return [...this.tasks];
    }
    //add new method to push the current state to undo stack
    pushToUndoStack() {
        this.undoStack.push(this.getCurrentState());
    }
    //add method to push the current state to redo stack
    pushToRedoStack() {
        this.redoStack.push(this.getCurrentState());
    }
    //add method to pop state from the undo stack
    popFromUndoStack() {
        return this.undoStack.pop();
    }
    //add method to pop state from the redi stack
    popFromRedoStack() {
        return this.redoStack.pop();
    }
    //Implement Undo methods
    undo() {
        if (this.undoStack.length > 0) {
            const prevState = this.popFromUndoStack();
            if (prevState) {
                this.tasks = prevState;
                this.pushToRedoStack();
            }
        }
    }
    //Implement Redo methods
    redo() {
        if (this.redoStack.length > 0) {
            const nextState = this.popFromRedoStack();
            if (nextState) {
                this.tasks = nextState;
                this.pushToUndoStack();
            }
        }
    }
    //Add reminder method: I have used notifier from node
    checkDueDateReminders() {
        const today = new Date();
        for (const task of this.tasks) {
            if (task.dueDate && this.isDueDateApproaching(task.dueDate, today)) {
                notifier.notify({
                    title: 'Task Reminder',
                    message: `Task "${task.title}" is approaching its due date!`
                });
            }
        }
    }
    isDueDateApproaching(dueDate, today) {
        const daysBeforeReminder = 2;
        const timeDifference = dueDate.getTime() - today.getTime();
        const daysDifference = timeDifference / (1000 * 3600 * 24);
        return daysDifference <= daysBeforeReminder;
    }
    //Add new method to Task Manager Filtering features
    filterTasks(criteria) {
        switch (criteria) {
            case 'category':
                return this.tasks.filter((task) => task.category === 'work');
            case 'priority':
                return this.tasks.filter((task) => task.priority === 'high');
            case 'dueDate':
                return this.tasks.filter((task) => task.dueDate && task.dueDate.getTime() < new Date().getTime());
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                console.log(chalk_1.default.red('Invalid filtering criterion.'));
                return [];
        }
    }
}
exports.TaskManager = TaskManager;
