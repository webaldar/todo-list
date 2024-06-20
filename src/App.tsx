import './App.css';
import {Todolist} from "./Todolist";
import {useState} from "react";
import {v1} from "uuid";
import {log} from "util";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
export type TasksStateType = {
    [key: string]: TaskType[]
}

export type FilterValuesType = 'all' | 'active' | 'completed'

type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

function App() {
    const todolistId1 = v1()
    const todolistId2 = v1()

    const [todolists, setTodolists] = useState<TodolistType[]>([
        {id: todolistId1, title: 'learn', filter: 'all'},
        {id: todolistId2, title: 'buy', filter: 'all'},
    ])

    const [tasks, setTasks] = useState<TasksStateType>({
        [todolistId1] : [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},
        ],
        [todolistId2] : [
            {id: v1(), title: 'Rest API', isDone: true},
            {id: v1(), title: 'GraphQL', isDone: false},
        ],
    })

    const removeTodolist = (todolistId: string) => {
        const newTodolists = todolists.filter(tl => (tl.id !== todolistId))
        setTodolists(newTodolists)
        console.log(tasks)
        delete tasks[todolistId]
        console.log(tasks)
        setTasks({...tasks})
    }
    const removeTask = (taskId: string, todolistId: string) => {
        const todolistTasks = tasks[todolistId]
        const newTodolistTasks = todolistTasks.filter(t => (t.id !== taskId))
        tasks[todolistId] = newTodolistTasks

        setTasks({...tasks, newTodolistTasks})
    }
    const addTask = (title: string, todolistId: string) => {
        const newTask = {
            id: v1(),
            title: title,
            isDone: false
        }
        const todolistTasks = tasks[todolistId]

        tasks[todolistId] = [newTask, ...todolistTasks]
        setTasks({...tasks})
    }


    const changeFilter = (filter: FilterValuesType, todolistId: string) => {
        let filtredTodolist = todolists.map(tl => {
            return tl.id == todolistId ? {...tl, filter} : tl
        })
        setTodolists(filtredTodolist)
    }


    const changeStatus = (taskId: string, taskStatus: boolean, todolistId: string) => {
        const todolistTasks = tasks[todolistId]
        let newTodolistTasks = todolistTasks.map(t => (t.id == taskId ? {...t, isDone: taskStatus} : t))
        tasks[todolistId] = newTodolistTasks
        setTasks({...tasks})
    }

    return (
        <div className="App">
            {todolists.map(tl => {
                const allTasksForTodolist = tasks[tl.id]
                let tasksForTodolist = allTasksForTodolist
                if (tl.filter === 'active') {
                    tasksForTodolist = allTasksForTodolist.filter(task => !task.isDone)
                }

                if (tl.filter === 'completed') {
                    tasksForTodolist = allTasksForTodolist.filter(task => task.isDone)
                }
                return (
                    <Todolist
                        title={tl.title}
                        tasks={tasksForTodolist}
                        removeTask={removeTask}
                        todolistId={tl.id}
                        removeTodolist={removeTodolist}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeStatus}
                        filter={tl.filter}
                    />
                )
            })}

        </div>
    );
}

export default App;
