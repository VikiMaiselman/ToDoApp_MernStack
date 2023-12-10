import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import Task from "./Task";

const url = "http://localhost:3006";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
};

export default function TasksContainer({ subclass, errorHandler, error }) {
  const [tasks, setTasks] = useState([]);

  const pathname = window.location.pathname;
  const page =
    window.location.pathname === "/"
      ? "Today"
      : window.location.pathname.substring(1);

  const getTasks = async () => {
    try {
      const response = await axios.get(
        `${url}${pathname}`,
        { withCredentials: true },
        headers
      );
      const { result } = response.data;
      const sublist = result.find((sublist) => sublist.name === subclass);
      setTasks(() => sublist.tasks);
    } catch (error) {
      console.error(error);
      errorHandler({
        hasError: true,
        errMsg: error.response.data.result,
      });
    }
  };

  async function fetchData() {
    await getTasks();
  }

  useEffect(() => {
    fetchData();
  }, []);

  const addTask = async (newTask) => {
    try {
      await axios.post(
        `${url}/${page}/createTask`,
        newTask,
        { withCredentials: true },
        headers
      );
    } catch (error) {
      errorHandler({
        hasError: true,
        errMsg: error.response.data.result,
      });
    }

    fetchData();
  };

  const removeTask = async (task) => {
    try {
      await axios.post(
        `${url}/${page}/deleteTask`,
        task,
        { withCredentials: true },
        headers
      );
    } catch (error) {
      errorHandler({
        hasError: true,
        errMsg: error.response.data.result,
      });
    }

    fetchData();
  };

  const updateTask = async (data) => {
    try {
      await axios.post(
        `${url}/${page}/updateTask`,
        data,
        { withCredentials: true },
        headers
      );
    } catch (error) {
      errorHandler({
        hasError: true,
        errMsg: error.response.data.result,
      });
    }

    fetchData();
  };

  const metadataForNewTask = {
    subclass: subclass,
    page: page,
  };

  return (
    <div className={`TasksContainer ${subclass}`}>
      <h1>
        {subclass} Do ! ({page})
      </h1>
      <div className="TasksContainer-allTasks">
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            updateTask={updateTask}
            removeTask={removeTask}
          />
        ))}
      </div>
      <TaskForm
        isFormToUpdateTask={false}
        actionOnFormSubmission={addTask}
        metadataForNewTask={metadataForNewTask}
      />
    </div>
  );
}
