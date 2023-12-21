//src/main.ts

export interface Task{
    id: number;
    title: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date | undefined;
    completed: boolean;
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
}
