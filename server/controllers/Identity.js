import {v4 as uuidv4 }from 'uuid';

const idController = {

    getClientId : (req, res)=>{
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
            console.log("Error while fetching clientId: ", err);
        }
    },

    getNoteId : (req, res)=>{
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
                clients[clientId].notes.push(noteId);//client maintains array of noteId 
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
        console.log("Error while fetching nodeId: ", err);
res.writeHead(400, {'Content-Type': 'text/plain'});
    }

}
}
export default idController;
