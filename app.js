const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();
const _ = require("lodash");

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
  useFindAndModify: false,
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

const listSchema = {
  name: String,
  items: [itemSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    // if there's no item, insert default items
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) console.log(err);
        else console.log("Successfully inserted default items to database.");
      });
      res.redirect("/");
    }
    // else, render items
    else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

/////////////////////////////////////////////////////////////////
/////////////////////// POST (INPUTS) ///////////////////////////
/////////////////////////////////////////////////////////////////

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list; // button's name

  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

// Delete items via checkbox
app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      (err, foundList) => {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.get("/:customPage", (req, res) => {
  const customPage = _.capitalize(req.params.customPage);

  List.findOne({ name: customPage }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        // Create a default list
        const list = new List({
          name: customPage,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customPage);
      } else {
        //show an existing list
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
  const list = new List({
    name: customPage,
    items: defaultItems,
  });
  list.save();
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
