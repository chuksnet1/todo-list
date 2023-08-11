//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { name } = require("ejs");
const _ = require("lodash");
//const date = require(__dirname + "/date.js");    //becasue this is local and not install with npm. it goes into the file date.js and try to run all the file function

//console.log(date());


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');


mongoose.connect("mongodb://localhost:27017/todolistDB")
.then(()=>console.log('connected'))
.catch(e=>console.log(e));



const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);


//creating a document based on the schema structure
const item1 = new Item({
    name: "welcome to your todolist"
});

const item2 = new Item({
    name: "come join me eat food"
});

const item3 = new Item({
    name: "we are here for you"
});


const defaultItem = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
}

const ListItem = mongoose.model("ListItem", listSchema);



app.get("/", function (req, res) {

    const itemFunc = async () => {
        //.find() is to display all the item in the database collection
        const itemResult = await Item.find({})

        if (itemResult.length === 0) {
            //to save all item in the array into the database
            Item.insertMany(defaultItem)
                .then(function () {
                    console.log("successfully saved default data");
                })
                .catch(err => {
                    console.log(err);
                });
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "day", newListItem: itemResult });     //when using ejs
        }
    }

    itemFunc();


});


app.post("/", (req, res) => {

    console.log(req.body);

    let itemName = req.body.toDo;
    let listName = req.body.list;

    //we check if nothing is entered at the input box, then do nothing
    if (itemName == "") {
        return;
    }

    //putting the entered list` into the Item database
    const itemEntered = new Item({
        name: itemName
    })


    //to check where the page that trigered the post request
    if (listName === "day") {
        itemEntered.save();
        res.redirect("/");
    } else {
        //find the pagee/route name in the database and save the list item entered to it
        const findAndMoveTOPage = async()=>{
            const checkPageName = await ListItem.findOne({ name: `${listName}` });
            checkPageName.items.push(itemEntered);
            checkPageName.save();
            res.redirect("/"+listName);
        }
        findAndMoveTOPage();
    }

});



app.get("/:postName", function (req, res) {
    const customeListName = _.capitalize(req.params.postName);

    const findList = async () => {

        const checking = await ListItem.findOne({ name: `${customeListName}` });
        if (!checking) {
            //create new list
            console.log("doesnt exist")

            const list = new ListItem({
                name: customeListName,
                items: defaultItem
            });
            list.save();
            res.redirect("/" + customeListName);
        } else {
            //show an existing list
            console.log("exist")
            res.render("list", { listTitle: checking.name, newListItem: checking.items });
        }
        //console.log(checking);

    }
    findList();


})



app.post("/work", function (req, res) {
    let item = req.body.toDo;

    workItems.push(item);
    res.redirect("/work");

})


//To delete the list that was checked
app.post("/delete", function (req, res) {
    const checkedId = req.body.checkbox;
    const listName = req.body.listName;


    console.log(req.body);

    if (listName === "day") {
        console.log("done")
        const deleteItem = async () => {
            await Item.findByIdAndDelete({ _id: `${checkedId}` });
        }
        deleteItem();
        res.redirect("/");
    } else {
        //to delete from home page that is not our default page
        //we use this method cos list item is an array inside the array
        const findAndDelelete = async()=>{
            await ListItem.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedId}}})
            res.redirect("/"+ listName);
        }
        findAndDelelete()
        console.log("not done")
    }

    
});


//another route for about
app.get("/about", function (req, res) {
    res.render("about")
});


app.listen(3000, function () {
    console.log("Server is listening at port 3000");
})
