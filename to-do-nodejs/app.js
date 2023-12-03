// import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = 3006;
const possibleSublists = ["Must", "Should", "Could", "Would"];
let TasksList, Task; // mongoose models

app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);
app.use("*", function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
// enable pre-flight
app.options("*", cors());

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function initializeDatabase() {
  try {
    await mongoose.connect("mongodb://localhost:27017/ToDoApp");
  } catch (error) {
    console.error(error);
    // handle error appropriately
  }

  const TaskSchema = new mongoose.Schema({
    text: String,
    isCompleted: Boolean,
    subclass: {
      type: String,
      enum: possibleSublists,
    },
    page: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
    },
  });

  const TasksListSchema = new mongoose.Schema({
    page: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      enum: possibleSublists,
    },
    tasks: [TaskSchema],
  });

  Task = mongoose.model("Task", TaskSchema);
  TasksList = mongoose.model("TasksList", TasksListSchema);

  const dbCondition = await TasksList.find();

  if (dbCondition.length === 0) {
    for (let sublist of possibleSublists) {
      const tasksList = new TasksList({
        page: "Today",
        name: sublist,
        tasks: [],
      });
      await tasksList.save();
    }
  }
}
initializeDatabase();

app.get("/", async (req, res) => {
  let results;
  try {
    results = await TasksList.find({ page: "Today" });
    return res.json({ result: results });
  } catch (error) {
    console.error(error);
    // handle error appropriately
  }
});

app.get("/:pagename", async (req, res) => {
  const pageName = req.params.pagename;

  try {
    let foundAlreadyExistingList = await TasksList.find({ page: pageName });
    // console.log("existing", foundAlreadyExistingList);
    if (foundAlreadyExistingList.length !== 0)
      return res.json({ result: foundAlreadyExistingList });

    if (foundAlreadyExistingList.length === 0) {
      //   console.log("triggered", req.params.pagename);
      for (let sublist of ["Must", "Should", "Could", "Would"]) {
        const tasksList = new TasksList({
          page: pageName,
          name: sublist,
          tasks: [],
        });
        await tasksList.save();
      }

      foundAlreadyExistingList = await TasksList.find({ page: pageName });
      return res.json({ result: foundAlreadyExistingList });
    }

    results = await TasksList.find({ page: "Today" });
    return res.json({ result: results });
  } catch (error) {
    console.error(error);
    // handle error appropriately
  }
});

// app.get("/", async (req, res) => {});
// app.get("/", async (req, res) => {});

app.post("/createTask", async (req, res) => {
  try {
    const task = req.body;
    const newTask = {
      text: task.text,
      isCompleted: false,
      subclass: task.subclass,
      page: task.page,
      id: task.id,
    };

    await TasksList.updateOne(
      { page: task.page, name: task.subclass },
      { $push: { tasks: newTask } }
    );

    return res.status(201).json("Successfully created");
  } catch (error) {
    console.error(error);
    // handle error appropriately
  }
});

app.post("/updateTask", async (req, res) => {
  try {
    const task = req.body.task;
    const isCompleted = req.body.isCompleted;

    await TasksList.findOneAndUpdate(
      { page: task.page, name: task.subclass, "tasks.id": task.id },
      {
        $set: {
          "tasks.$.text": task.text,
          "tasks.$.isCompleted": isCompleted,
        },
      }
    );

    return res.status(200).json("Successfully updated the task.");
  } catch (error) {
    console.error(error);
    // handle error appropriately
  }
});

app.post("/deleteTask", async (req, res) => {
  try {
    const task = req.body;

    await TasksList.updateOne(
      { page: task.page, name: task.subclass },
      { $pull: { tasks: { id: task.id } } }
    );

    return res.status(200).json("Successfully removed");
  } catch (error) {
    console.error(error);
    // handle error appropriately
  }
});

app.listen(port, () => console.log(`Server's up. Listening on port ${port}`));

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log(
      "Mongoose connection is disconnected due to application termination"
    );
    process.exit(0);
  } catch (error) {
    console.error(error);
  }
});
