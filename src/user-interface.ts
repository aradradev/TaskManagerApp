//src/main1.ts
import * as readlineSync from 'readline-sync'
import { Task, TaskManager } from './task-manager'


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
                ID: ${task.id},
                Title: ${task.title},
                Priority: ${task.priority},
                Due Date: ${task.dueDate || 'Not set'},
                Completed: ${task.completed ? 'Yes' : 'No'}
            `)
        });
    }
}

export const taskManager = new TaskManager()

export function runTaskManager(taskManager: TaskManager) {
    while (true) {
        console.log('\n Task Manager Menu:')
        console.log('1. Add Task')
        console.log('2. Edit Task')
        console.log('3. Delete Task')
        console.log('4. View Tasks')
        console.log('5. Exit');

        const choice = readlineSync.keyIn('Enter your choice: ')
        switch (choice) {
            case '1':
                const newTaskInput = getUserInput();
                taskManager.addTask({
                    ...newTaskInput,
                    id: taskManager.getTasks().length + 1,
                    completed: false
                } as Task);
                console.log('Task added successfully');
                break;
            case '2':
                const taskId = parseInt(readlineSync.question('Enter task ID to edit: '), 10)
                const editTaskInput = getUserInput()
                taskManager.editTask(taskId, editTaskInput as Partial<Task>)
                console.log('Task edited successfully.')
                break;
            case '3':
                const deleteTaskId = parseInt(readlineSync.question('Enter task ID to delete: '), 10)
                taskManager.deleteTask(deleteTaskId)
                console.log('Task deleted successfully.');
                break;
            case '4':
                const allTasks = taskManager.getTasks()
                displayTasks(allTasks)
                break;
            case '5':
                process.exit(0)
                
        
            default:
                console.log('Invalid choice. Please enter a valid number between 1 and 5.')
        }
    }
}
