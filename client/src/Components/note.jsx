import {Link, useLocation, useParams} from "react-router-dom";
import Canvas from "./canvas";
import useWebSocket from "react-use-websocket";
import {useState, useEffect} from "react";
let title = "";
let content = ""
let prevCoordArray = [[]];

export default function Note(){
    const noteId = useParams();
    const WS_URL = `ws://127.0.0.1:5000/${noteId}`;
    const location = useLocation();
    const clientId = location.state.clientId;
    let drawing = {x:0,y:0};
    let mouseType = "";

    const {lastJsonMessage, sendJsonMessage} = useWebSocket(WS_URL,{
        onOpen: ()=>{
            console.log("Websocket connection established");
        },
        share: true,
        retryOnError: true,
        shouldReconnect: ()=>true
    });


    useEffect(()=>{
        title = lastJsonMessage?.data.title;
        content = lastJsonMessage?.data.content;
        console.log("The join client status :",location.state.joinClient);
        console.log("the clientid : ", location.state.clientId);
        console.log("The noteId: ", noteId);
        console.log("The noteId: ", noteId.id);

        if(location.state.joinClient){
            console.log("Im not a owner");
            sendJsonMessage({
                type: 'joinclient',
                noteId: noteId.id,
                clientId: clientId
            })
        }
        else if(!location.state.joinClient){
            sendJsonMessage({
                type: 'headingchange',
                title: location.state.title,
                noteId: noteId.id,
                clientId: location.state.clientId 
            })
        }

    },[]);

    drawing = lastJsonMessage?.data.drawingContent;
    mouseType = lastJsonMessage?.data.mouseType;

    function handlesubmit(e){
        e.preventDefault();
    }

    title = lastJsonMessage?.data.title;
    content = lastJsonMessage?.data.content;

    function handleHeadingChange(e){
        console.log("Message from server: ",lastJsonMessage);
        // console.log(e.target.value);
        sendJsonMessage({
            type: 'headingchange',
            title: e.target.value,
            noteId: noteId.id
        });
    }
    function handleChangeTextArea(e){
        console.log(e.target.value);
        sendJsonMessage({
            type: 'contentchange',
            content: e.target.value,
            noteId: noteId.id
        });
    }
    return(
        <>
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
                    noteId = {noteId}
                    style = {
                        {
                            border: '2px solid blue',
                            display: 'block',
                        }
                    }
                    prevCoordArray= {prevCoordArray}
                    width={window.innerWidth} height={window.innerHeight}
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
        </>
    )
}
