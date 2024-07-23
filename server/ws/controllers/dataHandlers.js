import {getTitle, getAlldata, lastCoord, getContent, getWholeCoordArray} from "./getData.js"

const typeDef = {
    NEW_NOTE: 'userevent',
    NOTE_CONTENT_CHANGE: 'contentchange',
    DRAW_CONTENT: 'drawcontent',
    NOTE_HEADING_CHANGE: 'headingchange',
    JOIN_CLIENT: 'joinclient',
}

export async function handleContentChange(data, connection) {
    try{
        let json = {
            type: data.type,
        }
        const content = data.content;
        const noteId = data.noteId;
        const clientId = data.clietnId;
        const query = "UPDATE notes SET noteContent=(?) WHERE noteId=(?);"; 
        const queryStat = await connection.query(query, [content,noteId]);
        if(queryStat.length){
            console.log("printing content: ",queryStat);
            console.log("Successfully updated content");
        }
        const noteContent = await getContent(connection, noteId);
        json.data = {
            content: noteContent,
            noteId: noteId
        }
        console.log("Before returning json from content: ", json);
        return json;
    }
    catch(err) {
        console.log("Error while updating noteContent in notes table: ", err);
    }
}

export async function handleDrawingContent (data, connection) {
    try{
        console.log("HandlingDrawing");
        const noteId = data.noteId;
        const {x, y} = data.coord;
        let json = {
            type: data.type,
        }
        json.data = {
            drawingContent: data.coord,
            noteId: noteId,
            mouseType: data.mouseType,
            wholeArray: data.wholeArray
        };
        // console.log("Before returning json from drawing: ", json);
        return json;
    }
    catch(err){
        console.log("Error while handling drawing content: ", err);
    }
}

export async function handleJoinClient(data, connection) {
    try {
        const clientId = data.clientId;
        const noteId = data.noteId;
        console.log("Handling join client");
        let json = {
            type: data.type
        };
        const checkQuery = "SELECT * FROM note_members WHERE clientId=(?);"
        const checkQueryStat = await connection.query(checkQuery,[clientId]);
        if(checkQueryStat != 0) {
            console.log("Old user");
        }
        else {
            const query = "INSERT INTO note_members(noteId, clientId) VALUES(?,?);"
            await connection.query(query,[noteId, clientId]);
            console.log("A new user joined to the noteId");
        }
        const alldata = await getAlldata(data, connection);
        json.data = alldata;
        console.log("Before return json from join client: ", json);
        return json;
    }
    catch(err) {
        console.log("Error while handling joint client: ", err);
    }
}

export async function handleHeadingContent(data, connection) {
    const noteId = data.noteId;
    const title = data.title;
    const clientId = data.clientId;
    let json = {
        type: data.type,
    };
    try{
        const updateTitleRow = "UPDATE notes SET title=(?) WHERE noteId=(?);"
        await connection.query(updateTitleRow,[title,noteId]);
        console.log("Successfully updated note title");
        const titleFromDb = await getTitle(connection, noteId);
        json.data={
            title: titleFromDb,
            noteId: noteId
        }
        console.log("Before return json from heading content: ", json);
        return json;
    }
    catch(err){
        console.log("Error while handling heading content: ", err);
    }
}

