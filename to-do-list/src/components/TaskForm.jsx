import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import "../styles/TaskForm.css";
import "../styles/Task.css";

export default function TaskForm({
  isFormToUpdateTask,
  actionOnFormSubmission,
  metadataForNewTask,
  metadataForExistingTask,
  setIsBeingEdited,
}) {
  const [task, setTask] = useState({
    text: metadataForExistingTask?.text || "",
    id: metadataForExistingTask?.id || "",
    isCompleted: metadataForExistingTask?.isCompleted || false,
    subclass: metadataForExistingTask?.subclass || metadataForNewTask.subclass,
    page: metadataForExistingTask?.page || metadataForNewTask.page,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTask((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleClick = (event) => {
    event.preventDefault();

    if (!isFormToUpdateTask) {
      actionOnFormSubmission({ ...task, id: uuidv4() });
      console.log(task);
      setTask({ ...task, text: "", id: "" });
    }

    if (isFormToUpdateTask) {
      actionOnFormSubmission({task: task, isCompleted: task.isCompleted});
      setTask({ text: task.text, id: task.id });
      setIsBeingEdited(false);
    }
  };

  let btn;
  if (isFormToUpdateTask) {
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
        name="text"
        value={task.text}
        onChange={handleChange}
      />
      {btn}
    </form>
  );
}
