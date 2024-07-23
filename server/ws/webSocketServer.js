import {WebSocket, WebSocketServer} from 'ws'
import pool from "../db/db.js"

import {
    handleContentChange,
    handleDrawingContent,
    handleJoinClient,
    handleHeadingContent
} from "./controllers/dataHandlers.js"

let clients = new Set();

const typeDef = {
    NEW_NOTE: 'userevent',
    NOTE_CONTENT_CHANGE: 'contentchange',
    DRAW_CONTENT: 'drawcontent',
    NOTE_HEADING_CHANGE: 'headingchange',
    JOIN_CLIENT: 'joinclient',
}

async function handleMessage(msg, wss, dbConnection) {
    let data = {};
    const dataFromClient = JSON.parse(msg.toString());

    if(dataFromClient.type === typeDef.NOTE_CONTENT_CHANGE){
        data = await handleContentChange(dataFromClient, dbConnection);
    }
    else if(dataFromClient.type === typeDef.DRAW_CONTENT){
        console.log("Before calling handleDrawing");
        data = await handleDrawingContent(dataFromClient, dbConnection);
    }
    else if(dataFromClient.type === typeDef.NOTE_HEADING_CHANGE){
        data = await handleHeadingContent(dataFromClient, dbConnection);
    }
    else if(dataFromClient.type === typeDef.JOIN_CLIENT){
        data = await handleJoinClient(dataFromClient, dbConnection);
    }
    console.log("Client Id: ", dataFromClient);
    broadCastMessage(data, wss);
}

//broadcast function
function broadCastMessage(params, connection) {
    console.log("Broadcasting");
    const data = JSON.stringify(params);
    connection.clients.forEach(function each(client){
        if(client.readyState === WebSocket.OPEN){
            client.send(data);
            // console.log(data);
            console.log("Success");
        }
        else{
            console.log("failed");
        }
    });
}

function handleDisconnect(connection) {
    console.log("Disconnected");
}
async function getDbConnection() {
    try{
        const con = await pool.getConnection(); 
        return con;
    }
    catch(err){
        console.log("Error creating connection to db from web socket server:", err);
    }
}

function setupWebSocket(server) {
    // console.log("thhe server is: ", server);
    const wsServer = new WebSocketServer({server});
    wsServer.on('connection', async function (connection) {
        const dbConnection = await getDbConnection();
        console.log("server: client connected to server");
        connection.on('message',
            (msg)=>handleMessage(msg,wsServer,dbConnection)
        );
        connection.on('close',()=>handleDisconnect());
    })
}
export default setupWebSocket;
