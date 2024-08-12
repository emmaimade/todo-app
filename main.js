const express = require('express');
const mongoose = require('mongoose');

const Todo = require("./model");

const app = express();
const port = 3000;
const dbURI = "mongodb://localhost:27017/todoDB";

// connect to database
mongoose.connect(dbURI)
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log("Error connecting to database", err);
    });

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get("/", async(req, res) => {
    const todos = await Todo.find();
    res.render('index', { todos } );
});

// adds a todo
app.post("/add-todo", async(req, res) => {
    const { todo } = req.body;

    if (!todo) {
        res.redirect("/");
    }

    const newTodo = new Todo({ name: todo});
    await newTodo.save();

    res.redirect("/");
})

// deletes a todo
app.get("/delete-todo/:id", async(req, res) => {
    const { id } = req.params;
    
    if (!id) {
        res.redirect("/");
    }

    await Todo.deleteOne({ _id: id });
    res.redirect("/");
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})