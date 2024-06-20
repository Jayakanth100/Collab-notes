import {WebSocket, WebSocketServer} from 'ws'
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
function handleDisconnect(){
    console.log("Disconnected");
}
function setupWebSocket(server){
    console.log("thhe server is: ", server);
    const wsServer = new WebSocketServer({server});
    wsServer.on('connection', function (connection){
        console.log("server: client connected to server");
        connection.on('message',(msg)=>handleMessage(msg,connection));
        connection.on('close',()=>handleDisconnect());
    })
}
export default setupWebSocket;
