const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/todoViews/index.html');
});

app.get('/css/style.css', function(req, res) {
    res.sendFile(__dirname + '/todoViews/css/style.css');
});

app.get('/todo.js', function(req, res) {
    res.sendFile(__dirname + '/todoViews/js/todo.js');
});

app.get('/getTodos', function(req, res) {
    readTodosFromFile(function(err, todos) {
        if(err) {
            res.status(500).send('Error reading file');
        } else {
            res.status(200).send(todos);
        }
    });
});

app.post('/todo', function(req, res) {
    let todoContent = req.body.todoContent;
    let todoCompleted = false;
    let todo = {todoContent, todoCompleted};
    appendTodoToFile(todo, function(err){
        if(err){
            res.status(500).send('Error writing to file');
        } else {
            res.status(200).send('Success');
        }
    });
});

app.post('/updateTodo', function(req, res) {
    let todoId = req.body.todoId;
    let todoCompleted = req.body.todoCompleted;
    readTodosFromFile(function(err, todos) {
        if(err) {
            res.status(500).send('Error reading file');
        } else {
            todos[todoId].todoCompleted = todoCompleted;
            fs.writeFile('./todos.json', JSON.stringify(todos), function(err){
                if(err){
                    res.status(500).send('Error writing to file');
                } else {
                    res.status(200).send('Success');
                }
            });
        }
    });
});

app.post('/deleteTodo', function(req, res) {
    let todoId = req.body.todoId;
    readTodosFromFile(function(err, todos) {
        if(err) {
            res.status(500).send('Error reading file');
        } else {
            todos.splice(todoId, 1);
            fs.writeFile('./todos.json', JSON.stringify(todos), function(err){
                if(err){
                    res.status(500).send('Error writing to file');
                } else {
                    res.status(200).send('Success');
                }
            });
        }
    });
});

app.listen(3000, function() {
    console.log('Server running on port 3000');
});


function readTodosFromFile(callback){
    let todos = [];
    fs.readFile('./todos.json', 'utf8', function(err, data){
        if(err){
            callback(err);
        } else {
            todos = JSON.parse(data);
            callback(null, todos);
        }
    });
}

function appendTodoToFile(todo, callback){
    readTodosFromFile(function(err, todos){
        if(err){
            callback(err);
        } else {
            todos.push(todo);
            fs.writeFile('./todos.json', JSON.stringify(todos), function(err){
                if(err){
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    });
}