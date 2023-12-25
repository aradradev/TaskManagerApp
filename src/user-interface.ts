//src/main1.ts
import * as readlineSync from 'readline-sync'
import { Task, TaskManager } from './task-manager'
import chalk from 'chalk'


interface UserInput {
    title?: string
    priority?: 'low' | 'medium'| 'high'
    dueDate?: string
}

//Get User Input Function
export function getUserInput(): UserInput {
    const title = readlineSync.question('Enter task title: ')
    const priorityOptions = ['low', 'medium', 'high']
    const priorityIndex = readlineSync.keyInSelect(priorityOptions, 'Select task priority: ')
    const priority = priorityIndex !== -1 ? (priorityOptions[priorityIndex] as 'low' | 'medium' | 'high') : 'low'
    const dueDate = readlineSync.question('Enter due Date (optional , format: YYYY-MM-DD: ') || ''

    return {
        title,
        priority: priority as 'low' | 'medium' | 'high',
        dueDate,
    }
}

//Display Task Function
export function displayTasks(tasks: Task[]): void{
    if (tasks.length === 0) {
        console.log('No task available!')
    } else {
        tasks.forEach(task => {
            console.log(`
                ID: ${chalk.blue(task.id)},
                Title: ${chalk.yellow(task.title)},
                Priority: ${chalk.red(task.priority)},
                Due Date: ${chalk.cyan(task.dueDate || 'Not set')},
                Completed: ${chalk.green(task.completed ? 'Yes' : 'No')}
            `)
        });
    }
}

export const taskManager = new TaskManager()

export function runTaskManager(taskManager: TaskManager) {
    while (true) {
        console.log(chalk.green('\n Task Manager Menu:'))
        console.log(chalk.blue('[1]. Add Task'))
        console.log(chalk.blue('[2]. Edit Task'))
        console.log(chalk.blue('[3]. Delete Task'))
        console.log(chalk.blue('[4]. View Tasks'))
        console.log(chalk.blue('[5]. Sort Tasks'))
        console.log(chalk.blue('[6]. Save Tasks to File'))
        console.log(chalk.blue('[7]. Load Tasks from File'))
        console.log(chalk.blue('[8]. Exit'));

        const choice = readlineSync.keyIn('Enter your choice: ')
        switch (choice) {
            case '1':
                const newTaskInput = getUserInput();
                taskManager.addTask({
                    ...newTaskInput,
                    id: taskManager.getTasks().length + 1,
                    completed: false,
                    dueDate: new Date(newTaskInput.dueDate || 0)
                } as Task);
                console.log(chalk.green('Task added successfully'));
                break;
            case '2':
                const taskId = parseInt(readlineSync.question('Enter task ID to edit: '), 10)
                const editTaskInput = getUserInput()
                taskManager.editTask(taskId, editTaskInput as Partial<Task>)
                console.log(chalk.green('Task edited successfully.'))
                break;
            case '3':
                const deleteTaskId = parseInt(readlineSync.question('Enter task ID to delete: '), 10)
                taskManager.deleteTask(deleteTaskId)
                console.log(chalk.green('Task deleted successfully.'));
                break;
            case '4':
                const allTasks = taskManager.getTasks()
                displayTasks(allTasks)
                break;
            case '5':
                const sortCriterionIndex = readlineSync.keyInSelect(['priority', 'dueDate', 'completed'], 'Select sorting criterion: ')
                if (sortCriterionIndex !== -1) {
                    const sortCriterion = ['priority', 'dueDate', 'completed'][sortCriterionIndex]
                    taskManager.sortTasksBy(sortCriterion as 'priority' | 'dueDate' | 'completed')
                    console.log(`${chalk.green(`Tasks sorted by ${sortCriterion}.`)}`);
                }
                break;
            case '6':
                taskManager.saveTasksToFile();
                break;
            case '7':
                taskManager.loadTasksFromFile()
                break;
            case '8':
                console.log(chalk.green('Thank you, have a good time. Bye!'))
                process.exit(0)
                
        
            default:
                console.log(chalk.red('Invalid choice. Please enter a valid number between 1 and 5.'))
        }
    }
}
