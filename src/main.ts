//src/main.ts

interface Task{
    id: number;
    title: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
    completed: boolean;
}
class TaskManager {
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

    getTask(): Task[] {
        return this.tasks
    }
}

const exampleTask: Task = {
    id: 1,
    title: 'Sample Title',
    priority: 'medium',
    dueDate: new Date('2023-12-31'),
    completed: false,
};


const taskManager = new TaskManager()

taskManager.addTask(exampleTask);

taskManager.editTask(1, { completed: true });

console.log(taskManager.getTask())

taskManager.deleteTask(1);

// console.log(taskManager.getTask())


