import React, { useState } from "react";
import TaskForm from "./TaskForm";
import Task from "./Task";

export default function TasksContainer({ subclass }) {
  const [tasks, setTasks] = useState([]);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const removeTask = (taskUuid) => {
    setTasks(tasks.filter((task) => task.uuid !== taskUuid));
  };

  const updateTask = (taskUuid, updatedTaskText, taskIsCompleted) => {
    console.log(tasks);
    const updatedTasks = tasks.map((task) => {
      if (task.uuid === taskUuid)
        return {
          ...task,
          taskText: updatedTaskText || task.taskText,
          isCompleted: taskIsCompleted || task.isCompleted,
        };
      return task;
    });
    setTasks(updatedTasks);
  };

  return (
    <div className={`TasksContainer ${subclass}`}>
      <h1>{subclass} Do</h1>
      <div>
        {tasks.map((task) => (
          <Task
            key={task.uuid}
            task={task}
            updateTask={updateTask}
            removeTask={removeTask}
          />
        ))}
      </div>
      <TaskForm toUpdateTask={false} action={addTask} />
    </div>
  );
}
