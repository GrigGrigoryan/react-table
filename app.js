const express = require('express');
const app = express();
const path = require('path');
const createError = require('http-errors');
const fs = require('fs');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(process.env.root));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());
app.use(session({
    secret: 'achonik',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 60000},
    secure: 'production'
}));

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

const UserService = require('./modules/user-service');

const userService = new UserService(app.locals);

const Services = {userService};

fs.readdirSync('routes')
    .filter(file => file.substr(0, 1) !== '.')
    .forEach(file => {
        const fn = file.split('.').slice(0, -1).join('.');
        require(`./routes/${file}`)(app, Services, fn);
    });

const opts = {
    server: {
        auto_reconnect: true,
        socketOptions: {
            connectTimeoutMS: 180000,
            socketTimeoutMS: 180000,
            keepAlive: 1
        }
    },
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}
const db = mongoose.createConnection('mongodb://127.0.0.1:27017/grish', opts);

require('./models/users');

app.locals.db = {
    users: db.model('users')
}

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to API'
    });
});

app.post('/api/posts', verifyToken, (req,res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            console.log(authData);
            res.json({
                message: 'Post created...',
                authData
            });
        }
    });
    res.json({
        message: 'Post created'
    });
});

//TOKEN FORMAT
//Authorization: Bearer <access_token>

//verify token
function verifyToken (req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');

        const bearerToken = bearer[1];

        req.token = bearerToken;

        next();
    } else {
        res.sendStatus(403);
    }
}

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//     next(createError(404));
// });

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    if (req.accepts('application/json')) {
        return res.json({
            status: 'Error',
            message: err.message
        });
    }

    res.render('error', {err});
});

module.exports = app;