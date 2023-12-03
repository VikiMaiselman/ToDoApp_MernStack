import React, { useState } from "react";
import TaskForm from "./TaskForm";
import "../styles/Task.css";

export default function Task({ task, updateTask, removeTask }) {
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleEdit = () => {
    setIsBeingEdited(true);
  };

  const toggleTaskCompleted = () => {
    setIsCompleted(() => !isCompleted);
    updateTask(task.uuid, undefined, isCompleted);
  };

  const contents = isBeingEdited ? (
    <TaskForm
      toUpdateTask={true}
      action={updateTask}
      prevTaskState={task}
      setIsBeingEdited={setIsBeingEdited}
    />
  ) : (
    <div className="Task">
      {isCompleted ? (
        <span
          style={{ textDecoration: "line-through" }}
          onClick={toggleTaskCompleted}
        >
          {task.taskText}
        </span>
      ) : (
        <span onClick={toggleTaskCompleted}>{task.taskText}</span>
      )}
      {/* <span onClick={toggleTaskCompleted}>{task.taskText}</span> */}
      <div className="Task-handlerButtons">
        <button className="Task-HandlerButton Edit " onClick={handleEdit}>
          <i class="fa fa-pencil" aria-hidden="true"></i> Edit
        </button>
        <button
          className="Task-HandlerButton Delete"
          onClick={() => removeTask(task.uuid)}
        >
          <i class="fa fa-trash-o" aria-hidden="true"></i> Delete
        </button>
      </div>
    </div>
  );

  return <>{contents}</>;
}
