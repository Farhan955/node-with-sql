const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json())

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'movie',
    multipleStatements: true
});

conn.connect((err) => {
    if (!err) {
        console.log('db connected');
    } else {
        console.log('db connection failed : ' + JSON.stringify(err, undefined, 2));
    }
});

app.listen(3000, () => console.log('Express is running at 3000 port'));


//get all movies
app.get('/movies', (req, res) => {
    conn.query('SELECT * FROM movies', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});


//Get an review of specific movie
app.get('/ratings/:id', (req, res) => {
    conn.query('SELECT movieId,rating,comment,userid ,name,image  FROM `ratings` r INNER JOIN `users` u ON r.userid = u.id WHERE movieId = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});


//Insert an movie
app.post('/movies', (req, res) => {
    let obj = req.body;
    var sql = "INSERT INTO movies (title, length, year, director, description, actors, image)\
     VALUES ('"+ obj.title + "', '" + obj.length + "','" + obj.year + "','" + obj.director + "','" + obj.description + "','" + obj.actors + "','" + obj.image + "')";

    conn.query(sql, function (err, result) {
        if (err) throw err;
        let s = '{"msg":"Movie Inserted"}';
        res.send(s);
    });

});



//Insert an Comment and rating
app.post('/ratings', (req, res) => {
    let obj = req.body;

    var sql = "INSERT INTO ratings (movieId, rating,comment, userId)\
     VALUES ('"+ obj.movieId + "', '" + obj.rating + "','" + obj.comment + "','" + obj.userId + "')";

    conn.query(sql, function (err, result) {
        if (err) throw err;
        let s = '{"msg":"Ratings Inserted"}';
        res.send(s);
    });

});

//Insert an User
app.post('/users', (req, res) => {
    let obj = req.body;

    var sql = "INSERT INTO users (name, email,image, token)\
     VALUES ('"+ obj.name + "', '" + obj.email + "','" + obj.image + "','" + obj.token + "')";

    conn.query(sql, function (err, result) {
        if (err) throw err;
        let s = '{"msg":"Ratings Inserted"}';
        res.send(s);
    });

});

//Get an user
app.get('/users/:email', (req, res) => {
    conn.query('SELECT * FROM users WHERE email= ?', [req.params.email], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Get  users
app.get('/users', (req, res) => {
    conn.query('SELECT * FROM users', [req.params.email], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});
