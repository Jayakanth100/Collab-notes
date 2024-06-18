import http from 'http'
import {v4 as uuidv4 }from 'uuid';
import {WebSocket, WebSocketServer} from 'ws'
import express from "express"
import cors from "cors"
//variables
const port = 5000;
let wsConnections = [];
let clients = [];
let client = {};
let notes = [];
let note = {};
let data = {};
let users = {};
let user = null;

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

app.get("/clientId",(req, res)=>{
    try{
        const clientId = uuidv4();
        client.notes = [];
        while(!clients[clientId]){
            clients[clientId] = client;
        }
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(clientId);
    }
    catch(err){
        console.error("Error generating client ID:", error);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end("Internal Server Error");
    }
});
app.post("/noteId",(req, res)=>{
    try{
        let requestBody = "";
        let noteId = "";
        req.on('data' , chunk=>{
            requestBody += chunk.toString();
        });
        req.on('end', ()=>{
            const {clientId} = JSON.parse(requestBody);
            if(clientId){
                noteId = uuidv4();
                clients[clientId].notes.push(noteId);
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(noteId);
                console.log("success");
            }
            else{
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end("ClientId is required");
            }
        });
    }
    catch(err){
        console.log("Error getting noteId: ");
        console.log("What is wrong with you: ",err);
        res.writeHead(400, {'Content-Type': 'text/plain'});
    }
});
const typeDef = {
    NEW_NOTE: 'userevent',
    NOTE_CONTENT_CHANGE: 'contentchange',
    DRAW_CONTENT: 'drawcontent',
    NOTE_HEADING_CHANGE: 'headingchange',
    JOIN_CLIENT: 'joinclient',
}
//broadcast function
function broadCastMessage(params) {
    console.log("Params: ", params);
    const data = JSON.stringify(params);
    const noteId = params.data.noteId;
    const userArray = (params.data.users[noteId]);
    if(userArray){
        for(let i = 0; i <  userArray.length; i++){
            // console.log("user-> ",params.data.drawingContent);
            userArray[i].send(data);
            console.log("success");
        }
    } 
}
//handle functions 
function handleMessage(msg, connection){
    console.log("hello");
    let flag = 0;
    const dataFromClient = JSON.parse(msg.toString());
    const json = {
        type: dataFromClient.type,
    }
    if(dataFromClient.type === typeDef.NOTE_CONTENT_CHANGE){
        const client = clients[dataFromClient.clientId];
        const noteId = dataFromClient.noteId;
        const content = dataFromClient.content;
        console.log(content);
        //changing the note content in client note
        notes[noteId] = {content: content};
        json.data = {users: users,  content: notes[noteId].content, noteId: noteId};
    }
    else if(dataFromClient.type === typeDef.DRAW_CONTENT){
        const noteId = dataFromClient.noteId;
        const {x , y}= dataFromClient.coord;
        notes[noteId] = {drawing: {x, y}, wholeArray: dataFromClient.wholeArray};
        console.log("The whole array is :", dataFromClient.wholeArray);
        json.data = {
            users: users,
            drawingContent: notes[noteId].drawing,
            noteId: noteId,
            mouseType: dataFromClient.mouseType,
            wholeArray: dataFromClient.wholeArray
        };
    }
    else if(dataFromClient.type === typeDef.NOTE_HEADING_CHANGE){
        const noteId = dataFromClient.noteId;
        const clientId = dataFromClient.clientId;
        const title = dataFromClient.title;
        notes[noteId] = {title: title};
        if(users[noteId] === undefined){
            users[noteId] = [connection];
            // console.log("Owner is added");
        }
        // console.log("The note title: ", notes[noteId]);
        json.data = {users: users, title: notes[noteId].title, noteId:noteId};
    }
    else if(dataFromClient.type === typeDef.JOIN_CLIENT){
        const clientId = dataFromClient.clientId;
        const noteId = dataFromClient.noteId;
        if(users[noteId]){
            users[noteId].push(connection);
        }
        else{
            users[noteId] = [connection];
        }
        console.log("The wholeArry is: ", notes[noteId].wholeArray);
        json.data = {users: users, wholeArray: notes[noteId].wholeArray,title: notes[noteId].title, content: notes[noteId].content, noteId: noteId};
    }
    broadCastMessage(json);
}
function handleDisconnect(){
    console.log("Disconnected");
}
app.listen(port);
//websocket server
const wsServer = new WebSocketServer({server});
wsServer.on('connection', function (connection){
    console.log("server: client connected to server");
    connection.on('message',(msg)=>handleMessage(msg,connection));
    connection.on('close',()=>handleDisconnect());
})
