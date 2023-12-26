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
exports.runTaskManager = exports.taskManager = exports.displayTasks = exports.getUserInput = void 0;
//src/main1.ts
const readlineSync = __importStar(require("readline-sync"));
const task_manager_1 = require("./task-manager");
//this is for coloring my command for better user friendly experience.
const chalk_1 = __importDefault(require("chalk"));
//Get User Input Function
function getUserInput() {
    const category = readlineSync.question('Enter task category: ');
    const title = readlineSync.question('Enter task title: ');
    const priorityOptions = ['low', 'medium', 'high'];
    const priorityIndex = readlineSync.keyInSelect(priorityOptions, 'Select task priority: ');
    const priority = priorityIndex !== -1 ? priorityOptions[priorityIndex] : 'low';
    const dueDate = readlineSync.question('Enter due Date (optional , format: YYYY-MM-DD: ') || '';
    return {
        category,
        title,
        priority: priority,
        dueDate,
    };
}
exports.getUserInput = getUserInput;
//Display Task Function
function displayTasks(tasks) {
    if (tasks.length === 0) {
        console.log(chalk_1.default.yellow('No task available!'));
    }
    else {
        tasks.forEach(task => {
            console.log(`
                ID: ${chalk_1.default.blue(task.id)},
                Category: ${chalk_1.default.blueBright(task.category) || 'Not set'}
                Title: ${chalk_1.default.yellow(task.title)},
                Priority: ${chalk_1.default.red(task.priority)},
                Due Date: ${chalk_1.default.cyan(task.dueDate || 'Not set')},
                Completed: ${chalk_1.default.green(task.completed ? 'Yes' : 'No')}
            `);
        });
    }
}
exports.displayTasks = displayTasks;
exports.taskManager = new task_manager_1.TaskManager();
setInterval(() => {
    exports.taskManager.checkDueDateReminders();
}, 24 * 60 * 60 * 1000);
function runTaskManager(taskManager) {
    while (true) {
        console.log(chalk_1.default.green('\n Task Manager Menu:'));
        console.log(chalk_1.default.blue('[1]. Add Task'));
        console.log(chalk_1.default.blue('[2]. Edit Task'));
        console.log(chalk_1.default.blue('[3]. Delete Task'));
        console.log(chalk_1.default.blue('[4]. View Tasks'));
        console.log(chalk_1.default.blue('[5]. Sort Tasks'));
        console.log(chalk_1.default.blue('[6]. Save Tasks to File'));
        console.log(chalk_1.default.blue('[7]. Load Tasks from File'));
        console.log(chalk_1.default.blue('[8]. Undo Task'));
        console.log(chalk_1.default.blue('[9]. Redo Task'));
        console.log(chalk_1.default.blue('[A]. Filter Tasks'));
        console.log(chalk_1.default.blue('[0]. Exit'));
        const choice = readlineSync.keyIn('Enter your choice: ');
        switch (choice) {
            case '1':
                const newTaskInput = getUserInput();
                taskManager.addTask(Object.assign(Object.assign({}, newTaskInput), { id: taskManager.getTasks().length + 1, completed: false, dueDate: new Date(newTaskInput.dueDate || 0) }));
                console.log(chalk_1.default.green('Task added successfully'));
                break;
            case '2':
                const taskId = parseInt(readlineSync.question('Enter task ID to edit: '), 10);
                const editTaskInput = getUserInput();
                taskManager.editTask(taskId, editTaskInput);
                console.log(chalk_1.default.green('Task edited successfully.'));
                break;
            case '3':
                const deleteTaskId = parseInt(readlineSync.question('Enter task ID to delete: '), 10);
                taskManager.deleteTask(deleteTaskId);
                console.log(chalk_1.default.green('Task deleted successfully.'));
                break;
            case '4':
                const allTasks = taskManager.getTasks();
                displayTasks(allTasks);
                break;
            case '5':
                const sortCriterionIndex = readlineSync.keyInSelect(['priority', 'dueDate', 'completed'], 'Select sorting criterion: ');
                if (sortCriterionIndex !== -1) {
                    const sortCriterion = ['priority', 'dueDate', 'completed'][sortCriterionIndex];
                    taskManager.sortTasksBy(sortCriterion);
                    console.log(`${chalk_1.default.green(`Tasks sorted by ${sortCriterion}.`)}`);
                }
                break;
            case '6':
                taskManager.saveTasksToFile();
                break;
            case '7':
                taskManager.loadTasksFromFile();
                break;
            case '8':
                taskManager.undo();
                console.log(chalk_1.default.yellow('Undo operation performed.'));
                break;
            case '9':
                taskManager.redo();
                console.log(chalk_1.default.yellow('Redo operation performed.'));
                break;
            case 'A':
                const filterOptions = ['category', 'priority', 'dueDate', 'completed'];
                const filterCriterionIndex = readlineSync.keyInSelect(filterOptions);
                if (filterCriterionIndex !== -1) {
                    const filterCriterion = ['category', 'priority', 'dueDate', 'completed'][filterCriterionIndex]; //assertion here.
                    const filteredTasks = taskManager.filterTasks(filterCriterion);
                    displayTasks(filteredTasks);
                    console.log(chalk_1.default.green(`Tasks filtered by "${filterCriterion}".`));
                }
                else {
                    console.log(chalk_1.default.yellow('No filter criterion selected.'));
                }
                break;
            case '0':
                console.log(chalk_1.default.yellow('Thank you, have a good time. Bye :)'));
                process.exit(0);
            default:
                console.log(chalk_1.default.red('Invalid choice. Please enter a valid number between 0 and 9.'));
        }
    }
}
exports.runTaskManager = runTaskManager;
