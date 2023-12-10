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
    return res.status(400).json({
      result:
        "There is an internal server/ database problem. Contact the support. ",
    });
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
    return res.status(400).json({ result: "Could not fetch data. Try again." });
  }
});

app.get("/:pagename", async (req, res) => {
  const pageName =
    req.params.pagename[0].toUpperCase() +
    req.params.pagename.slice(1).toLowerCase();

  try {
    let foundAlreadyExistingList = await TasksList.find({ page: pageName });
    if (foundAlreadyExistingList.length !== 0)
      return res.json({ result: foundAlreadyExistingList });

    if (foundAlreadyExistingList.length === 0) {
      for (let sublist of possibleSublists) {
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
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      result: "Could not fetch data. Try again.",
    });
  }
});

app.post("/:page/createTask", async (req, res) => {
  try {
    const task = req.body;

    const pageName =
      task.page[0].toUpperCase() + task.page.slice(1).toLowerCase();

    const newTask = {
      text: task.text,
      isCompleted: false,
      subclass: task.subclass,
      page: pageName,
      id: task.id,
    };

    await TasksList.updateOne(
      { page: pageName, name: task.subclass },
      { $push: { tasks: newTask } }
    );

    return res.status(201).json("Successfully created");
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      result: "Could not add your task. Try again or contact the support.",
    });
  }
});

app.post("/:page/updateTask", async (req, res) => {
  try {
    const task = req.body.task;
    const isCompleted = req.body.isCompleted;

    const pageName =
      task.page[0].toUpperCase() + task.page.slice(1).toLowerCase();

    await TasksList.findOneAndUpdate(
      { page: pageName, name: task.subclass, "tasks.id": task.id },
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
    return res.status(400).json({
      result: "Could not update your task. Try again or contact the support.",
    });
  }
});

app.post("/:page/deleteTask", async (req, res) => {
  try {
    const task = req.body;

    const pageName =
      task.page[0].toUpperCase() + task.page.slice(1).toLowerCase();

    await TasksList.updateOne(
      { page: pageName, name: task.subclass },
      { $pull: { tasks: { id: task.id } } }
    );

    return res.status(200).json("Successfully removed");
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      result: "Could not remove your task. Try again or contact the support.",
    });
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
