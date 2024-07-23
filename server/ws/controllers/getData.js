
const typeDef = {
    NEW_NOTE: 'userevent',
    NOTE_CONTENT_CHANGE: 'contentchange',
    DRAW_CONTENT: 'drawcontent',
    NOTE_HEADING_CHANGE: 'headingchange',
    JOIN_CLIENT: 'joinclient',
}
export async function getTitle(connection, noteId) {
    const query = "SELECT title from notes WHERE noteId = (?);";
    const title = await connection.query(query,[noteId]);
    console.log("Title: ", title[0].title);
    return title[0].title;
}
export async function getContent(connection, noteId){
    const query = "SELECT noteContent from notes WHERE noteId = (?);"
    const content = await connection.query(query, [noteId]);
    console.log("content: ", content);
    return content[0].noteContent;
}
export async function getWholeCoordArray(connection, noteId) {
    const wholeArrayQuery =
        "SELECT x, y FROM coordinates WHERE noteId = (?);"
    const wholeArray =
        await connection.query(wholeArrayQuery, [noteId]);
    return wholeArray;
}
export async function lastCoord(connection, noteId) {
    const coordQuery =
        "SELECT x, y FROM coordinates WHERE noteId = (?) ORDER BY id DESC LIMIT 1;";
    const coordQueryStat =
        await connection.query(coordQuery,[noteId]);
    const x = coordQueryStat[0].x;
    const y = coordQueryStat[0].y;
    console.log("lastcoord: ",x,y );
    return {x, y}
}

export async function getAlldata(data, connection) {
    return {
        noteId: data.noteId,
        title: await getTitle(connection, data.noteId),
        content: await getContent(connection, data.noteId),
        // wholearray: await getWholeCoordArray(connection, data.noteId) 
        wholeArray: data.wholeArray
    }
    console.log(json);
    return json;
}

