import express from 'express';
import http from 'http';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketServer } from 'ws';

const app = express();
const port = 5000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Variables
let clients = {};
let notes = {};
let users = {}; // Stores connected users for each note
const typeDef = {
    NEW_NOTE: 'userevent',
    NOTE_CONTENT_CHANGE: 'contentchange',
    DRAW_CONTENT: 'drawcontent',
    NOTE_HEADING_CHANGE: 'headingchange',
    JOIN_CLIENT: 'joinclient',
};

// HTTP routes
app.get('/clientId', (req, res) => {
    const clientId = uuidv4();
    clients[clientId] = { notes: [] };
    res.status(200).send(clientId);
});

app.post('/noteId', (req, res) => {
    const { clientId } = req.body;
    if (clientId && clients[clientId]) {
        const noteId = uuidv4();
        clients[clientId].notes.push(noteId);
        notes[noteId] = {}; // Initialize empty note content
        res.status(200).send(noteId);
    } else {
        res.status(400).send("ClientId is required or invalid.");
    }
});

// Creating HTTP server and WebSocket server
const server = http.createServer(app);
const wsServer = new WebSocketServer({ noServer: true });

// Broadcast function
function broadCastMessage(params) {
    const data = JSON.stringify(params);
    const noteId = params.data.noteId;
    const userArray = users[noteId];
    
    if (userArray) {
        for (let i = 0; i < userArray.length; i++) {
            userArray[i].send(data);
        }
    }
}

// Handle WebSocket message
function handleMessage(msg, connection) {
    const dataFromClient = JSON.parse(msg.toString());
    const json = { type: dataFromClient.type };
    
    if (dataFromClient.type === typeDef.NOTE_CONTENT_CHANGE) {
        const { noteId, content } = dataFromClient;
        notes[noteId] = { ...notes[noteId], content };
        json.data = { users, content: notes[noteId].content, noteId };
    } 
    else if (dataFromClient.type === typeDef.DRAW_CONTENT) {
        const { noteId, coord, wholeArray, mouseType } = dataFromClient;
        notes[noteId] = { ...notes[noteId], drawing: coord, wholeArray };
        json.data = { users, drawingContent: coord, noteId, mouseType, wholeArray };
    } 
    else if (dataFromClient.type === typeDef.NOTE_HEADING_CHANGE) {
        const { noteId, title } = dataFromClient;
        notes[noteId] = { ...notes[noteId], title };
        
        if (!users[noteId]) users[noteId] = [connection];
        json.data = { users, title: notes[noteId].title, noteId };
    } 
    else if (dataFromClient.type === typeDef.JOIN_CLIENT) {
        const { noteId } = dataFromClient;
        
        if (users[noteId]) {
            users[noteId].push(connection);
        } else {
            users[noteId] = [connection];
        }
        json.data = {
            users,
            wholeArray: notes[noteId].wholeArray,
            title: notes[noteId].title,
            content: notes[noteId].content,
            noteId,
        };
    }
    broadCastMessage(json);
}

// Handle WebSocket disconnection
function handleDisconnect(connection) {
    Object.keys(users).forEach(noteId => {
        users[noteId] = users[noteId].filter(conn => conn !== connection);
    });
    console.log("Client disconnected");
}

// WebSocket connection handling
wsServer.on('connection', (connection) => {
    console.log("WebSocket connection established");
    connection.on('message', (msg) => handleMessage(msg, connection));
    connection.on('close', () => handleDisconnect(connection));
});

// Handling WebSocket upgrade
server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (ws) => {
        wsServer.emit('connection', ws, request);
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

