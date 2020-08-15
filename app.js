const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();

// specify static folder where css,img files are
app.use(express.static("public"));
// setting up EJS
app.set("view engine", "ejs");
// setting up the body-parser
app.use(bodyParser.urlencoded({ extended: true }));

/////////////////////////////////////////////////////////////////
////////////////////////// DataBase /////////////////////////////
/////////////////////////////////////////////////////////////////

// Connect to DB
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create schema
const itemSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your todolist!",
});
const item2 = new Item({
  name: "Hit the + button to add a new item.",
});
const item3 = new Item({
  name: "<-- Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];
Item.insertMany(defaultItems, (err) => {
  if (err) console.log(err);
  else console.log("Successfully inserted default items to database.");
});

app.get("/", (req, res) => {
  res.render("list", { listTitle: "Today", newListItems: items });
});

/////////////////////////////////////////////////////////////////
/////////////////////// POST (INPUTS) ///////////////////////////
/////////////////////////////////////////////////////////////////

app.post("/", (req, res) => {
  let item = req.body.newItem;

  // push into work array
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  }
  // push into home array
  else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
