const express=require('express');
const bodyparser=require('body-parser');
const session=require('express-session');
const rutes=require('./rutes/rutes');
const MongoStore=require('connect-mongo')(session);
const passport=require('passport');

const MONGO_URL='mongodb://localhost:27017/auth';

const app=express();

app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true,
    store:new MongoStore({
        url:MONGO_URL,
        autoReconnect:true
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/api',rutes);

module.exports=app;
