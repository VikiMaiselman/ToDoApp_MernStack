import TasksContainer from "./TasksContainer";
import "../styles/App.css";
import "../styles/TasksContainer.css";

function App() {
  return (
    <div className="App">
      <h1 className="App-Header">
        <i class="fa fa-list-ul" aria-hidden="true"></i>
        <span className="Big"> T</span>
        <span className="Small">O</span> D<span className="Big">O</span> L
        <span className="Small">I</span>
        <span className="Big">S</span>
        <span className="Small">T</span>
      </h1>
      <TasksContainer subclass="Must" />
      <TasksContainer subclass="Should" />
      <TasksContainer subclass="Could" />
      <TasksContainer subclass="Would" />
    </div>
  );
}

export default App;
