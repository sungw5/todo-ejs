const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

let items = ["Coding", "Read Bible", "work out"];
let workItems = [];

// specify static folder where css,img files are
app.use(express.static("public"));
// setting up EJS
app.set("view engine", "ejs");
// setting up the body-parser
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  //   pass the variable  day

  // function from date.js
  let day = date.getDate();
  res.render("list", { listTitle: day, newListItems: items });
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
