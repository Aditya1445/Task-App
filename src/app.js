const path = require("path");
const hbs = require("hbs");
const express = require("express");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user-routes");
const taskRoutes = require("./routes/task-routes");
require("./db/mongoose");

const app = express();
app.use(cookieParser());
const port = process.env.PORT;

const viewsPath = path.join(__dirname, "../Templates/views");
const publicDirectory = path.join(__dirname, "../public");
const partialPath = path.join(__dirname, "../Templates/partials");
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialPath);
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(publicDirectory));
app.use(userRoutes);
app.use(taskRoutes);

app.get("", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
