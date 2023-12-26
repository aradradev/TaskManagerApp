//src/main.ts
import chalk from 'chalk';
import * as fs from 'fs'
import * as path from 'path'
import * as notifier from 'node-notifier'

export interface Task{
    id: number;
    title: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date | undefined;
    completed: boolean;
    category: string
}

export class TaskManager {
    private tasks: Task[] = []
    private undoStack: Task[][] = []
    private redoStack: Task[][] = []

    addTask(task: Task): void{
        this.pushToUndoStack();
        this.tasks.push(task)
        this.pushToRedoStack()
    }

    editTask(taskId: number, updatedTask: Partial<Task>): void{
        this.pushToUndoStack()

        const taskIndex = this.tasks.findIndex((task) => task.id === taskId)

        if (taskIndex !== -1) {
            this.tasks[taskIndex] = {...this.tasks[taskIndex], ...updatedTask}
        }

        this.pushToRedoStack()
    }

    deleteTask(taskId: number): void{
        this.pushToUndoStack()
        this.tasks = this.tasks.filter((task) => task.id !== taskId)
        this.pushToRedoStack()
    }

    getTasks(): Task[] {
        return this.tasks
    }

    //Adding new feature like sortTaskBy
    sortTasksBy(criteria: 'priority' | 'dueDate' | 'completed'): void {
        switch (criteria) {
            case "priority":
                this.tasks.sort((a, b) => a.priority.localeCompare(b.priority))
                break;
            case "dueDate":
                this.tasks.sort((a, b) => (a.dueDate || new Date(0) as Date).getTime() - (b.dueDate || new Date(0) as Date).getTime())
                break;
            case "completed":
                this.tasks.sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1)
                break;
            default:
                console.log(chalk.red('Invalid sorting criterion.'))
        }
    }

    //Save file implementation
    saveTasksToFile(): void{
        const tasksJson = JSON.stringify(this.tasks, null, 2)
        const defaultFileName = 'tasks-manager.json'
        const folderPath = 'DATABASE'
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath)
        }

        const filePath = path.join(folderPath, defaultFileName)
        fs.writeFileSync(filePath, tasksJson)
        
        console.log(`${chalk.green(`Tasks saved to ${filePath}.`)}`);
    }

    //Load file implementation from JSON
    loadTasksFromFile(): void{
        const defaultFileName = 'tasks-manager.json'
        const folderPath = 'DATABASE'

        const filePath = path.join(folderPath, defaultFileName)

        try {
            const tasksJson = fs.readFileSync(filePath, 'utf-8')
            const loadedTasks = JSON.parse(tasksJson)
            if (Array.isArray(loadedTasks)) {
                this.tasks = loadedTasks
                console.log(`${chalk.green(`Tasks loaded from ${filePath}.`)}`);
            } else {
                console.error(chalk.red('Invalid file format. Unable to load tasks.'));
            }
        } catch (error: any) {
            console.error(`${chalk.red(`Error loading tasks from ${filePath}: ${error.message}`)}`)
        }
    }

    //add new method to get current state
    getCurrentState(): Task[] {
        return [...this.tasks]
    }

    //add new method to push the current state to undo stack
    private pushToUndoStack(): void{
        this.undoStack.push(this.getCurrentState())
    }

    //add method to push the current state to redo stack
    private pushToRedoStack(): void{
        this.redoStack.push(this.getCurrentState())
    }

    //add method to pop state from the undo stack
    private popFromUndoStack(): Task[] | undefined {
        return this.undoStack.pop()
    }

    //add method to pop state from the redi stack
    private popFromRedoStack(): Task[] | undefined {
        return this.redoStack.pop()
    }

    //Implement Undo methods
    undo(): void{
        if (this.undoStack.length > 0) {
            const prevState = this.popFromUndoStack()
            if (prevState) {
                this.tasks = prevState
                this.pushToRedoStack()
            }
        }
    }

    //Implement Redo methods
    redo(): void{
        if (this.redoStack.length > 0) {
            const nextState = this.popFromRedoStack()
            if (nextState) {
                this.tasks = nextState
                this.pushToUndoStack()
            }
        }
    }

    //Add reminder method: I have used notifier from node
    checkDueDateReminders(): void{
        const today = new Date()

        for (const task of this.tasks) {
            if (task.dueDate && this.isDueDateApproaching(task.dueDate, today)) {
                notifier.notify({
                    title: 'Task Reminder',
                    message: `Task "${task.title}" is approaching its due date!`
                })
                
            }
        }
    }

    private isDueDateApproaching(dueDate: Date, today: Date): boolean{
        const daysBeforeReminder = 2
        const timeDifference = dueDate.getTime() - today.getTime()
        const daysDifference = timeDifference / (1000 * 3600 * 24)
        return daysDifference <= daysBeforeReminder
    }

    //Add new method to Task Manager Filtering features
    filterTasks(criteria: 'category' | 'priority' | 'dueDate' | 'completed'): Task[] {
        switch (criteria) {
            case 'category':
                return this.tasks.filter((task) => task.category === 'work')
            case 'priority':
                return this.tasks.filter((task) => task.priority === 'high')
            case 'dueDate':
                return this.tasks.filter((task) => task.dueDate && task.dueDate.getTime() < new Date().getTime())
            case 'completed':
                return this.tasks.filter(task => task.completed)
            default:
                console.log(chalk.red('Invalid filtering criterion.'));
                return []
                
        }
    }

}
