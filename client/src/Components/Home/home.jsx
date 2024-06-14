import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Login from "../Login/Login"
import GetTittleNewNote from "./GetTittleDesc/GetTitleNewNode"
import styles from "./Home.module.css"

function JoinNote({ clientId }) {
    const [noteId, setNoteId] = useState();
    function handleChange(e) {
        setNoteId(e.target.value);
    }
    return (
        <>
            <label htmlFor="noteId">
                Enter note id
            </label><br />
            <input
                value={noteId}
                onChange={handleChange}
                type="text"
                id="noteId" />
            <Link
                to={`/new-note/${noteId}`}
                state={{
                    noteId: noteId,
                    joinClient: true,
                    clientId: clientId
                }}>
                <button>Join</button>
            </Link>
        </>
    )
}

export default function Home() {
    const [userName, setUserName] = useState('');
    const [clientId, setClientId] = useState('');
    const [noteId, setNoteId] = useState('');
    const [titleDescModal, setTitleDescModal] = useState(false);
    const homeContainerRef = useRef(null);

    useEffect(()=>{
        if(userName){
            document.body.style.overflow = 'auto';
        }
        else{
            document.body.style.overflow = 'hidden';
        }
        return ()=>{
            document.body.style.overflow = 'hidden';
        };
    },[userName]);

    function toggleModal() {
        setTitleDescModal(!titleDescModal)
    }

    function createNote() {
        toggleModal();
        const requestBody = JSON.stringify({ clientId: clientId });
        fetch("http://localhost:5000/noteId", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        })
            .then(res => {
                console.log("Just response: ", res);
                return res.text();
            })
            .then(data => {
                console.log("The noteId is: ", data);
                setNoteId(data);
            })
            .catch((err) =>
            {console.log("Client: cant fetch noteId from server: ", err)});
    }
    return (
        <div ref={homeContainerRef} className={styles.homeContainer}>
            <div className={styles.homeContent}>
                <h1>This is home page</h1><br />
                {userName ?
                    <div>
                        <button
                            onClick={createNote}>
                            Create note
                        </button><br />

                        <JoinNote
                            clientId={clientId}>
                        </JoinNote>
                        {
                            titleDescModal &&
                                <GetTittleNewNote
                                    titleDescModal={titleDescModal}
                                    setTitleDescModal={setTitleDescModal}
                                    noteId={noteId}
                                    clientId={clientId} />
                        }
                    </div>
                    : <Login
                        onLogin={setUserName}
                        setClientId={setClientId} />
                }
            </div>
        </div>
    );
}
