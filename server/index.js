import {v4 as uuidv4 }from 'uuid';
import {cors} from 'cors';
import {WebSocket, WebSocketServer} from 'ws'
import http from 'http'
const server = http.createServer();
const wsServer = new WebSocketServer({server});
const port = 5000;
server.use(cors(corsOptions));
server.listen(port, ()=>{
    console.log(`Websocket server is running on ${port}`);
})

const corsOptions = {
    origin: '*',
};
//clients array
const clients = {};
const users = {};
let editorContent = null;
let headingContent = null;
let userActivity = [];
let someRandom = [];

const typeDef = {
    USER_EVENT: 'userevent',
    CONTENT_CHANGE: 'contentchange',
    HEADING_CHANGE: 'headingchange'
}

function broadcastMessage(json) {
    const data = JSON.stringify(json);
    console.log(data);
   for(let userId in clients){
       let client = clients[userId]; 
        if(client.readyState === WebSocket.OPEN){
            client.send(data);
        }
    } 
}

function handleMessage(message, userId) {
    const dataFromClient = JSON.parse(message.toString());   
    const json = {type: dataFromClient.type}

    if(dataFromClient.type === typeDef.USER_EVENT){
        users[userId] = dataFromClient; 
        userActivity.push(dataFromClient.username);
        json.data = {users, userActivity};
        console.log("userevent");
    }
    else if(dataFromClient.type === typeDef.CONTENT_CHANGE){
        editorContent = dataFromClient.content;
       json.data = {editorContent, userActivity, someRandom}; 

    }
    else if(dataFromClient.type === typeDef.HEADING_CHANGE){
        headingContent = dataFromClient.content;
        json.data = {headingContent, userActivity, someRandom};
    }
    broadcastMessage(json);
    
}
function handleDisconnect(){
    console.log("Disconnected");
}


wsServer.on('connection', function (connection) {
    const userId = uuidv4();
    console.log("Recieved new connection");

    clients[userId] = connection;
    console.log(`New user ${connection} with id ${userId} connected at ${port}`);
    connection.on('message',(msg)=> handleMessage(msg, userId));
    connection.on('close',()=>handleDisconnect());
})

