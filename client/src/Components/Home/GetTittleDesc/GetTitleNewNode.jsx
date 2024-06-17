import styles from "./GetTittle.module.css"
import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';


export default function GetTittleNewNote({titleDescModal, setTitleDescModal, setNoteId, clientId}) {

    const[title, setTitle] = useState('');
    const[descValue, setDescValue] = useState('');
    const textAreaRef = useRef(null);
    const titleAreaRef = useRef(null);
    const maxHeight = 150;
    const maxHeightTitle = 150;

    const navigate = useNavigate();
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
        console.log("Toggled model");
        setTitleDescModal(!titleDescModal)
    }
    function handleContainerClick(event){
        event.stopPropagation();
    }
    const getNoteId = async()=>{
        const requestBody = JSON.stringify({ clientId: clientId });
        console.log(requestBody);;
        try{
            const response = await fetch("http://localhost:5000/noteId",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: requestBody
            })
            console.log(response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.text();
            console.log("The noteId is: ", data);
            return data;
        }
        catch(error){
            console.error("Client: can't fetch noteId from server: ", error);
            return null;
        }
    }
    const handleClick= async()=>{
        toggleModal();
        const fetchedNoteId = await getNoteId();
        if(fetchedNoteId){
            setNoteId(fetchedNoteId);
            navigate(`/new-note/${fetchedNoteId}`,{
                state: {
                    title: title,
                    joinClinet: false,
                    noteId: fetchedNoteId,
                    clientId: clientId
                }
            });
        }
    };
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
                                    <button onClick={handleClick}>Ok</button>
                                <button onClick={()=>setTitleDescModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
