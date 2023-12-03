import React, { useState } from "react";
import TaskForm from "./TaskForm";
import "../styles/Task.css";

export default function Task({ task, updateTask, removeTask }) {
  const [isBeingEdited, setIsBeingEdited] = useState(false);

  const handleEdit = () => {
    setIsBeingEdited(true);
  };

  const toggleTaskCompleted = () => {
    updateTask({ task: task, isCompleted: !task.isCompleted });
  };

  const contents = isBeingEdited ? (
    <TaskForm
      isFormToUpdateTask={true}
      actionOnFormSubmission={updateTask}
      metadataForExistingTask={task}
      setIsBeingEdited={setIsBeingEdited}
    />
  ) : (
    <div className="Task">
      <span
        style={task.isCompleted ? { textDecoration: "line-through" } : null}
        onClick={toggleTaskCompleted}
      >
        {task.text}
      </span>
      <div className="Task-handlerButtons">
        <button
          className="Task-HandlerButton Edit"
          onClick={() => handleEdit()}
        >
          <i class="fa fa-pencil" aria-hidden="true"></i> Edit
        </button>
        <button
          className="Task-HandlerButton Delete"
          onClick={() => removeTask(task)}
        >
          <i class="fa fa-trash-o" aria-hidden="true"></i> Delete
        </button>
      </div>
    </div>
  );

  return <>{contents}</>;
}
