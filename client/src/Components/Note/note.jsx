import {Link, useLocation, useParams} from "react-router-dom";
import styles from "./Note.module.css"
import Canvas from "../Canvas/canvas";
import useWebSocket from "react-use-websocket";
import {useEffect} from "react";
let title = "";
let content = ""
let prevCoordArray = [[]];

export default function Note(){
    const noteId = useParams();
    const WS_URL = `ws://127.0.0.1:3000/${noteId}`;
    const location = useLocation();
    const clientId = location.state.clientId;
    let drawing = {x:0,y:0};
    let mouseType = "";
    let joinClient = false;

    const {lastJsonMessage, sendJsonMessage} = useWebSocket(WS_URL,{
        onOpen: ()=>{
            console.log("Websocket connection established");
        },
        share: true,
        retryOnError: true,
        shouldReconnect: ()=>true
    });

    useEffect(()=>{
        title = lastJsonMessage?.title;
        content = lastJsonMessage?.content;
        if(location.state.joinClient){
            joinClient = true;
            sendJsonMessage({
                type: 'joinclient',
                noteId: noteId.id,
                clientId: location.state.clientId 
            })
        }
        else if(!location.state.joinClient){
            sendJsonMessage({
                type: 'headingchange',
                title: location.state.title,
                noteId: noteId.id,
                clientId: clientId
            })
        }
    },[]);
    useEffect(()=>{
        console.log("Last json message: ",lastJsonMessage);
    },[lastJsonMessage]);


    drawing = lastJsonMessage?.data.drawingContent;
    mouseType = lastJsonMessage?.data.mouseType;

    function handlesubmit(e){
        e.preventDefault();
    }

    title = lastJsonMessage?.data.title;
    content = lastJsonMessage?.data.content;

    function handleHeadingChange(e) {
        sendJsonMessage({
            type: 'headingchange',
            title: e.target.value,
            noteId: noteId.id,
            clientId: clientId
        });
    }
    function handleChangeTextArea(e){
        sendJsonMessage({
            type: 'contentchange',
            content: e.target.value,
            noteId: noteId.id,
            clientId: clientId
        });
    }
    return(
        <div className={styles.noteContainer}>
            <form onSubmit={handlesubmit}>
                <label  htmlFor="notes-heading">Heading </label>
                <textarea
                    value = {title}
                    onChange = {handleHeadingChange}
                    type="text"
                    name="notes-heading"
                    id="notes-heading"
                /><br/>
                <label htmlFor="notes-content">Body</label><br/>
                <Canvas
                    sendJsonMessage = {sendJsonMessage}
                    lastJsonMessage = {lastJsonMessage}
                    noteId = {noteId.id}
                    style = {
                        {
                            border: '2px solid blue',
                            display: 'block',
                        }
                    }
                    prevCoordArray= {prevCoordArray}
                    width={window.innerWidth} height={window.innerHeight}
                    joinClient = {joinClient}
                />
                <textarea
                    value = {content}
                    onChange={handleChangeTextArea}
                    style={{height:"400px", width:"500px"}}
                    name="notes-content"
                    id="notes-content"
                    className="notes-content" >
                </textarea><br/>
                <button>Save</button>
                <Link to="..">
                    <button>Cancel</button>
                </Link>

            </form>
        </div>
    )
}
