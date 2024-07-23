import dotenv from 'dotenv'
// if(process.env.NODE_ENV != "production"){
    dotenv.config();
// }
import http from 'http'
import express from 'express'
import cors from 'cors'
import setupWebsocket from './ws/webSocketServer.js'
import idRoutes from './routes/router.js'
import bodyParser from 'body-parser'
import dbConnect from './db/db.js'
import jwt from "jsonwebtoken"
import passport from "passport"
import initialize from "./routes/passport.config.js"
import flash from "express-flash"
import session from "express-session"
import {checkAuthenticated} from "./controllers/checkAuth.js"

let wsConnections = [];
let clients = [];
let client = {};
let notes = [];
let note = {};
let data = {};
let users = {};
let user = null;
const typeDef = {
    NEW_NOTE: 'userevent',
    NOTE_CONTENT_CHANGE: 'contentchange',
    DRAW_CONTENT: 'drawcontent',
    NOTE_HEADING_CHANGE: 'headingchange',
    JOIN_CLIENT: 'joinclient',
}
const port = 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.raw({type: 'application/octet-stream'}));
initialize(passport);
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/api',idRoutes);

const server = http.createServer(app);
setupWebsocket(server);

//server initialization
server.listen(port, ()=>{
    console.log(`Websocket server is running on ${port}`);
})
