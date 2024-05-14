import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Note from "./note"
import Login from "./Login"

function JoinNote({clientId}){
    const [noteId, setNoteId] = useState();
    function handleChange(e){
        setNoteId(e.target.value);
    }
    return(
        <>
            <label htmlFor="noteId">Enter note id</label><br/>
            <input value={noteId} onChange={handleChange} type="text" id="noteId" />
            <Link to={`/new-note/${noteId}`} state={{ noteId: noteId, joinClient: true, clientId: clientId }}>
                <button >Join</button>
            </Link>
        </>
    )
}

function GetTitleNewNote({ noteId, clientId}) {
    const[title, setTitle] = useState('');
    function handleChangeTitle(e){
        setTitle(e.target.value);
        console.log(title);
    }
    return (<>
        <label htmlFor="title">Give title</label>
        <input value={title} onChange={handleChangeTitle} type="text" />
        <Link to={`/new-note/${noteId}`} state={{ title: title, joinClient: false,noteId: noteId, clientId: clientId }} element={<Note />} >
            <button>Ok</button>
        </Link>

    </>)
}
export default function Home() {
    const [userName, setUserName] = useState('');
    const [clientId, setClientId] = useState('');
    const [noteId, setNoteId] = useState('');
    function createNote() {
        const requestBody = JSON.stringify({clientId: clientId});
        fetch("http://localhost:5000/noteId",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        })
            .then(res=>{
                console.log("Just response: ",res);
                return res.text();
            })
            .then(data=>{
                console.log("The noteId is: ", data);
                setNoteId(data);
            })
            .catch(err=>console.log("Client: cant fetch noteId from server: ", err));

    }
    return (
        <>
            <h1>This is home page</h1><br />
            {userName ?
                <div>
                    <button onClick={createNote}>Create note</button><br />
           ]       <JoinNote clientId={clientId}></JoinNote>

                    {noteId && <GetTitleNewNote noteId={noteId} clientId={clientId} />}
                </div> : <Login onLogin={setUserName} setClientId={setClientId} />
            }
        </>
    );
}
