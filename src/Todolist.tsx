import {FilterValuesType, TaskType} from "./App";
import {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button} from "./Button";

type PropsType = {
    title: string
    tasks: TaskType[]
    removeTask: (taskId: string, todolistId: string) => void
    todolistId: string
    removeTodolist: (todolistId: string) => void
    changeFilter: (filter: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
    filter: FilterValuesType
}

export const Todolist = ({title, tasks, removeTask, todolistId, removeTodolist, changeFilter, addTask, changeTaskStatus, filter}: PropsType) => {
    const [taskTitle, setTaskTitle] = useState('')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const addTaskHandler = () => {
        if (taskTitle.trim()) {
            addTask(taskTitle.trim(), todolistId)
            setTaskTitle('')
        } else {
            setErrorMessage('Title is requred !')
        }
    }

    const removeTodolistHandler = (todolistId: string) => {
        removeTodolist(todolistId)
    }
    const changeTaskTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(event.currentTarget.value)
    }

    const addTaskOnKeyUpHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            addTaskHandler()
        } else {
            setErrorMessage(null)
        }
    }
    const resetErrorMesage = () => {
        setErrorMessage(null)
    }
    const changeFilterTasksHandler = (filter: FilterValuesType, todolistId: string) => {
        changeFilter(filter, todolistId)
    }

    return (
        <div>
            <div className={'todolist-title-container'}>
                <h3>{title}</h3>
                <Button onClick={() => removeTodolistHandler(todolistId)} title={'x'}/>
            </div>
            <div>
                <input className={errorMessage ? 'error' : ''}
                       value={taskTitle}
                       onChange={changeTaskTitleHandler}
                       onKeyUp={addTaskOnKeyUpHandler}
                       onClick={resetErrorMesage}
                />
                <Button title={'+'} onClick={addTaskHandler}/>
                {errorMessage && <div className={'error-message'}>{errorMessage}</div>}
            </div>
            {
                tasks.length === 0
                    ? <p>Тасок нет</p>
                    : <ul>
                        {tasks.map((task) => {
                            const removeTaskHandler = () => removeTask(task.id, todolistId)
                            const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
                                changeTaskStatus(task.id, e.currentTarget.checked, todolistId)
                            }

                            return <li className={task.isDone ? 'is-done' : ''} key={task.id}>
                                <input type="checkbox"
                                       checked={task.isDone}
                                       onChange={changeTaskStatusHandler}/>
                                <span>{task.title}</span>
                                <Button onClick={removeTaskHandler} title={'x'}/>
                            </li>
                        })}
                    </ul>
            }
            <div>
                <Button className={filter == 'all' ? 'active-filter' : ''} title={'All'}
                        onClick={() => changeFilterTasksHandler('all', todolistId)}/>
                <Button className={filter == 'active' ? 'active-filter' : ''} title={'Active'}
                        onClick={() => changeFilterTasksHandler('active', todolistId)}/>
                <Button className={filter == 'completed' ? 'active-filter' : ''} title={'Completed'}
                        onClick={() => changeFilterTasksHandler('completed', todolistId)}/>
            </div>
        </div>
    )
}
