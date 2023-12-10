import React, { useState } from "react";
import TasksContainer from "./TasksContainer";
import ErrorPage from "./ErrorPage";
import "../styles/App.css";
import "../styles/TasksContainer.css";

function App() {
  const [error, setError] = useState({
    hasError: false,
    errMsg: "",
  });

  const toReturn = error.hasError ? (
    <ErrorPage errMsg={error.errMsg} />
  ) : (
    <div className="App">
      <h1 className="App-Header">
        <i class="fa fa-list-ul" aria-hidden="true"></i>
        <span className="Big"> T</span>
        <span className="Small">O</span> D<span className="Big">O</span> L
        <span className="Small">I</span>
        <span className="Big">S</span>
        <span className="Small">T</span>
      </h1>
      <TasksContainer subclass="Must" errorHandler={setError} error={error} />
      <TasksContainer subclass="Should" errorHandler={setError} error={error} />
      <TasksContainer subclass="Could" errorHandler={setError} error={error} />
      <TasksContainer subclass="Would" errorHandler={setError} error={error} />
    </div>
  );

  return toReturn;
}

export default App;
