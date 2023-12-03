import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import "../styles/TaskForm.css";
import "../styles/Task.css";

export default function TaskForm({
  toUpdateTask,
  action,
  prevTaskState,
  setIsBeingEdited,
}) {
  const [task, setTask] = useState({
    taskText: prevTaskState?.taskText || "",
    uuid: prevTaskState?.uuid || "",
    isCompleted: prevTaskState?.isCompleted || false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTask((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleClick = (event) => {
    event.preventDefault();

    if (!toUpdateTask) {
      console.log(task);
      action({ ...task, uuid: uuidv4() });
      setTask({ taskText: "", uuid: "" });
    }

    if (toUpdateTask) {
      setTask({ taskText: task.taskText, uuid: task.uuid });
      setIsBeingEdited(false);
      action(task.uuid, task.taskText);
    }
  };

  let btn;
  if (toUpdateTask) {
    btn = (
      <button className="Task-HandlerButton Add" onClick={handleClick}>
        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>Update task
      </button>
    );
  } else {
    btn = (
      <button className="Task-HandlerButton Add" onClick={handleClick}>
        <i class="fa fa-plus-circle" aria-hidden="true"></i> Add task
      </button>
    );
  }
  return (
    <form className="TaskForm">
      <input
        className="TaskForm-Input Input"
        placeholder="Enter your next task..."
        type="text"
        name="taskText"
        value={task.taskText}
        onChange={handleChange}
      />
      {btn}
    </form>
  );
}
