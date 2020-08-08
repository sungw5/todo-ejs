const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let items = [];

// specify static folder where css,img files are
app.use(express.static("public"));
// setting up EJS
app.set("view engine", "ejs");
// setting up the body-parser
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  let today = new Date();
  //   let currentDay = today.getDay();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let day = today.toLocaleDateString("en-US", options);

  //   pass the variable  day
  res.render("list", { kindOfDay: day, newListItems: items });
});

/////////////////////////////////////////////////////////////////
/////////////////////// POST (INPUTS) ///////////////////////////
/////////////////////////////////////////////////////////////////

app.post("/", (req, res) => {
  let item = req.body.newItem;
  items.push(item);
  //  go back to home page
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
