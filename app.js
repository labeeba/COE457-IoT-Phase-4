const express = require('express');  //express
const cp = require('cookie-parser'); //cookie parser
const bodyParser = require('body-parser'); //body parser
const session = require('express-session'); //session cookie
//const NodeCouchDB = require('node-couchdb');
const nano = require('nano')('http://localhost:5984'); //using nano to connect to couchdb
const bcrypt = require('bcrypt');  //for encrypting passwords

//const path = require('path');
const fs = require('fs'); //file system

const app = express();


app.use(bodyParser.json());
//const couch = new NodeCouchDB();

// couch.listDatabases().then(function(dbs){
//     console.log(dbs);
// });

//const dbname = 'greencity';
const pins = nano.db.use('greencity'); //using an existing database for pin locations set by users

const users = nano.db.use('greencity_users'); //using an existing database for green city users

const bins = nano.db.use('greencity_bins'); //using an existing database for greencity bin locations and status

const salt_rounds = 15;

app.use(bodyParser.urlencoded({ extended: false })); //setting body parser
app.use(express.static(__dirname + '/public/')); //setting directory name
//app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'html');
app.set('port', process.env.PORT || 3000); //setting port
app.use(cp());                             //setting cookie parser
app.use(session({ secret: "Shh, its a secret!" }))  //secret to hash session cookies


//serving static html files 
function serveStaticFile(res, path, contentType, responseCode) {
    if (!responseCode) responseCode = 200;
    fs.readFile(__dirname + path, function (err, data) {
        if (err) {
            res.writeHead(500, { 'Content-Tye': 'text/plain' });
            res.end('500 - Internal Error');
        }
        else {
            res.writeHead(responseCode, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

//route for sending session username
app.get('/getUsername', function (req, res) {
    res.send(req.session.username);
});

//route for when a user attempts to login 
app.post('/loginAttempt', function (req, res) {
    //key to check for usernames 
    users.view('all_users', 'all', { include_docs: false, key: req.body.username }).then(body => {
        if (body.rows.length) {
            //console.log(body.rows[0].value) returns the hashed password from the db
            //comparing user entered password with hashed password
            bcrypt.compare(req.body.password, body.rows[0].value, (err, success) => {
                if (err) {
                    //sending an error message         
                    res.status(500).send("Error logging in");
                    console.log("Error logging in");

                } else if (success) {
                    //if password in db is correct 
                    //redirecting to dashboard route and starting session
                    req.session.username = req.body.username;
                    res.send('/dashboard');
                } else {
                    //wrong Password entered 
                    res.status(500).send('Wrong Password');
                    console.log("Wrong Password");

                }
            });
        } else {
            //user not found in the database
            res.status(404).send("User not found, please register first!")
            console.log("User not found ");
        }

    }).catch(err => {
        res.status(500).send("Cannot access database") //database is down
    });

});

//route for when a user attempts to register
app.post('/registerAttempt', function (req, res) {
    var email = req.body.email;
    var user = req.body.username;
    var pass = req.body.password;
    var loc = req.body.location;

    console.log(email);
    console.log(user);
    console.log(pass);
    console.log(loc);

    //hashing the users password using bcrypt
    bcrypt.hash(pass, salt_rounds, async function (err, hash) {
        if (!err) {
            try {
                //inserting into database
                await users.insert({
                    "email": email,
                    "username": user,
                    "password": hash,
                    "location": loc,
                }, null);  //null generates id
                res.send('/login');  //redirecting to login page after successful registration
            } catch (err) {
                console.log(err);
                res.status(500).send("Registration Error"); //registration error
            }
        }
        else {
            console.log(err);
            res.status(500).send("Registration Error"); //registration error
        }

    });

});

//sign out route
app.get('/signout', function(req,res){
    req.session.destroy((err)=>{
        if(err){
            res.status(500).send("Log out Error"); //log out error
        }
        else{
            res.redirect('/');  //redirect to home page
        }

    });
});

//home route
app.get('/', function (req, res) {
    serveStaticFile(res, '/public/html/index.html', 'text/html');
});

//login route
app.get('/login', function (req, res) {
    serveStaticFile(res, '/public/html/login.html', 'text/html');
});

//sign up route
app.get('/signup', function (req, res) {
    serveStaticFile(res, '/public/html/signup.html', 'text/html');
});

//dashboard route
app.get('/dashboard', function (req, res) {
    if (!req.session.username)  //if session username is not present
        serveStaticFile(res, '/public/html/login.html', 'text/html'); //render login page
    else
        serveStaticFile(res, '/public/html/dashboard.html', 'text/html'); //render dashboard page
});

//map route - displays map
app.get('/map', function (req, res) {
    if (!req.session.username) //if session username is not present
        serveStaticFile(res, '/public/html/login.html', 'text/html'); //render login page
    else
        serveStaticFile(res, '/public/html/map.html', 'text/html'); //render dashboard page
});

//home route - displays graph
app.get('/home', function (req, res) {
    if (!req.session.username) //if session username is not present
        serveStaticFile(res, '/public/html/login.html', 'text/html'); //render login page
    else
        serveStaticFile(res, '/public/html/home.html', 'text/html'); //render home page
});

//get pins route - gets pins from couchdb
app.get('/getpins', (req, res) => {
    console.log('Received a request from :' + req.hostname);
    var gotPins = [];
    //views
    pins.view('all_locations', 'all').then(body => {
        body.rows.forEach(doc => {
            //console.log(doc)
            //console.log(doc.value.lat);
            //storing values from couchdb in an array
            gotPins.push({ name: doc.value.name, time: doc.value.time, address: doc.value.address, lat: doc.value.lat, lng: doc.value.lng, count: doc.value.count });
        });
        console.log(gotPins); //array of latitude and longitude positions
        res.status(200).json(gotPins);  //response json object of array
    });
});

//get bins route
app.get('/getbins', (req, res) => {
    console.log('Received a request from :' + req.hostname);
    var gotBins = [];
    //views
    bins.view('all_bins', 'bins').then(body => {
        body.rows.forEach(doc => {
            //console.log(doc.value.lat);
            //storing values from couchdb in an array
            gotBins.push({ id: doc.value.binid, time: doc.value.time, temperature: doc.value.temperature, gas: doc.value.gas, clear: doc.value.clear, lat: doc.value.lat, lng: doc.value.lng });
            // gotBins.push(doc.value);

            // console.log(doc.value);
        });
        console.log(gotBins);
        res.status(200).json(gotBins);  //response json object of array
    });
});



// custom 404 page
app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

// custom 500 page
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});


app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');

});