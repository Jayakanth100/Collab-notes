import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Login from "../Login/Login"
import GetTittleNewNote from "./GetTittleDesc/GetTitleNewNode"
import NoteCards from "../NoteCards/NoteCards"
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
    }
    return (
        <div ref={homeContainerRef} className={styles.homeContainer}>
            <div className={styles.homeContent}>
                <h1>All Notes</h1><br />
                {userName ?
                    <div className={styles.newJoinNotes}>
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
                                    setNoteId={setNoteId}
                                    clientId={clientId} />
                        }
                        <NoteCards></NoteCards>
                    </div>
                    : <Login
                        onLogin={setUserName}
                        setClientId={setClientId} />
                }
            </div>
        </div>
    );
}
