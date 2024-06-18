import http from 'http'
import express from 'express'
import cors from 'cors'
import {v4 as uuidv4 }from 'uuid';
import {WebSocket, WebSocketServer} from 'ws'

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
const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Max-Age', '2592000'); // 30 days
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Generate and send unique client ID

    if(req.url == "/clientId"){
        const clientId = uuidv4();
        client.notes = [];
        while(!clients[clientId]){
            clients[clientId] = client;
        }
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(clientId);
    }
    else if(req.url == "/noteId"){
        let requestBody = "";
        let noteId = "";
        // console.log("The post res is:", req);
        req.on('data' , chunk=>{
            requestBody += chunk.toString();
        });
        req.on('end', ()=>{
            try{
                const {clientId} = JSON.parse(requestBody);
                if(clientId){
                    noteId = uuidv4();
                    clients[clientId].notes.push(noteId);//client maintains array of noteId 
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end(noteId);
                    console.log("success");
                }
                else{
                    res.writeHead(400, {'Content-Type': 'text/plain'});
                    res.end("ClientId is required");
                }
            }
            catch(err){
                console.log("What is wrong with you: ",err);
                res.writeHead(400, {'Content-Type': 'text/plain'});
                
            }
        });
    }
});
console.log(server);
const wsServer = new WebSocketServer({noServer: true});
const typeDef = {
    NEW_NOTE: 'userevent',
    NOTE_CONTENT_CHANGE: 'contentchange',
    DRAW_CONTENT: 'drawcontent',
    NOTE_HEADING_CHANGE: 'headingchange',
    JOIN_CLIENT: 'joinclient',
}
//server initialization
server.listen(port, ()=>{
    console.log(`Websocket server is running on ${port}`);
})
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
    let flag = 0;
    const dataFromClient = JSON.parse(msg.toString());
    const json = {
        type: dataFromClient.type,
    }
    if(dataFromClient.type === typeDef.NOTE_CONTENT_CHANGE){
        const client = clients[dataFromClient.clientId];
        const noteId = dataFromClient.noteId;
        const content = dataFromClient.content;
        //changing the note content in client note
        notes[noteId] = {content: content};
        json.data = {users: users,  content: notes[noteId].content, noteId: noteId};
    }
    else if(dataFromClient.type === typeDef.DRAW_CONTENT){
        const noteId = dataFromClient.noteId;
        const {x , y}= dataFromClient.coord;
        notes[noteId] = {drawing: {x, y}, wholeArray: dataFromClient.wholeArray};
        // console.log("The whole array is :", dataFromClient.wholeArray);
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
//websocket server
wsServer.on('connection', function (connection){
    console.log("server: client connected to server");
    connection.on('message',(msg)=>handleMessage(msg,connection));
    connection.on('close',()=>handleDisconnect());
})
