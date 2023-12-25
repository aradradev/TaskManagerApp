//src/main.ts
import chalk from 'chalk';
import * as fs from 'fs'
import * as path from 'path'

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

    addTask(task: Task): void{
        this.tasks.push(task)
    }

    editTask(taskId: number, updatedTask: Partial<Task>): void{
        const taskIndex = this.tasks.findIndex((task) => task.id === taskId)

        if (taskIndex !== -1) {
            this.tasks[taskIndex] = {...this.tasks[taskIndex], ...updatedTask}
        }
    }

    deleteTask(taskId: number): void{
        this.tasks = this.tasks.filter((task) => task.id !== taskId)
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

}
