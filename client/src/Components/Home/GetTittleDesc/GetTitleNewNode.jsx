import styles from "./GetTittle.module.css"
import Note from "../../Note/note"
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";


export default function GetTittleNewNote({titleDescModal,setTitleDescModal, noteId, clientId}) {

    const[title, setTitle] = useState('');
    const[descValue, setDescValue] = useState('');
    const textAreaRef = useRef(null);
    const titleAreaRef = useRef(null);
    const maxHeight = 150;
    const maxHeightTitle = 150;


    useEffect(()=>{
        const textArea = textAreaRef.current;
        textArea.style.height = 'auto';
        const scrollHeight = textArea.scrollHeight;
        textArea.style.height = `${Math.min(scrollHeight,parseInt(maxHeight))}px`;
    },[descValue, maxHeight]);

    useEffect(()=>{
        const textArea = titleAreaRef.current;
        textArea.style.height = 'auto';
        const scrollHeight = textArea.scrollHeight;
        textArea.style.height = `${Math.min(scrollHeight,parseInt(maxHeightTitle))}px`;
    },[title, maxHeightTitle]);

    function handleChangeTitle(e){
        setTitle(e.target.value);
        console.log(title);
    }
    function handleDescChange(e){
        setDescValue(e.target.value);
    }
    function toggleModal(){
        setTitleDescModal(!titleDescModal)
    }
    function handleContainerClick(event){
        event.stopPropagation();
    }
    return (
        <>
            <div className={styles.titleContainer}>
                <div onClick={toggleModal} className={styles.overlay}>
                    <div onClick={handleContainerClick} className={styles.inputContainers}>
                        <div className={styles.inputContainer}>
                            <label htmlFor="title">Give title</label>
                            <textarea
                                ref={titleAreaRef}
                                id={styles.title}
                                value={title}
                                onChange={handleChangeTitle}
                                type="text" />
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="">Give description</label>
                            <textarea
                                onChange={handleDescChange}
                                value={descValue}
                                name="description"
                                id={styles.titleDescription}
                                ref = {textAreaRef}
                            ></textarea>
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={styles.buttondiv}>
                                <Link
                                    onClick={toggleModal}
                                    to={`/new-note/${noteId}`}
                                    state={
                                        {
                                            title: title,
                                            joinClient: false,
                                            noteId: noteId,
                                            clientId: clientId
                                        }}
                                    element={<Note />} >

                                    <button>Ok</button>
                                </Link>
                                <button onClick={()=>setTitleDescModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
