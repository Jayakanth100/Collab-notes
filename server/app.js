import http from 'http'
import express from 'express'
import cors from 'cors'
import setupWebsocket from './ws/webSocketServer.js'
import idRoutes from './routes/router.js'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

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

const port = 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api',idRoutes);

const server = http.createServer(app);
console.log("thhe server is: ", server);
setupWebsocket(server);

//server initialization
server.listen(port, ()=>{
    console.log(`Websocket server is running on ${port}`);
})

