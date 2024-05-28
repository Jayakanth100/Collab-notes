import React, { useEffect, useRef, useState } from "react";
export default function Canvas({sendJsonMessage,lastJsonMessage,noteId,style}){
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [socketCoord, setSocketCoord] = useState([]);
    const [coordArray, setCoordArray] = useState([]);

    let drawn = {x:0,y:0};
    let mouseType = null;
    let prevCoordArray = [[]];
    drawn = lastJsonMessage?.data?.drawingContent;
    mouseType = lastJsonMessage?.data?.mouseType;
    prevCoordArray = lastJsonMessage?.data?.wholeArray;

    useEffect(()=>{
        if(drawn !== undefined){
            draw(mouseType,drawn.x,drawn.y);
            console.log("Received");
        }
    },[drawn]);
    useEffect(()=>{
        if(prevCoordArray !== undefined){
            console.log("Hello coords: ", prevCoordArray);
            Prevdraw(prevCoordArray);
        }
    },[prevCoordArray]);

    function Prevdraw(coords){
        for(let i = 0; i < coords.length; i++){
            contextRef.current.beginPath();
            for(let j = 0; j < coords[i].length; j++){
                let {x,y} = coords[i][j];
                if(j == 0){
                    contextRef.current.moveTo(x,y);
                }
                else{
                    contextRef.current.lineTo(x,y);
                    contextRef.current.stroke();
                }
            }
            contextRef.current.closePath();
        }
        console.log("Thats it");;
    }
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        canvas.width = window.innerWidth - rect.left;
        canvas.height = window.innerHeight - rect.top;
        ctx.strokeStyle = "red";
        contextRef.current = ctx;
        console.log("Hello");
    }, []);
    function getCanvasCoordinates(event) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY
        };
    }
    function draw(type,x,y){
        if(type === "mousedown"){
            contextRef.current.beginPath();
            contextRef.current.moveTo(x, y);
        }
        else if(type == "mousemove"){
            contextRef.current.lineTo(x, y);
            contextRef.current.stroke();
        }
        else{
            contextRef.current.closePath();
        }
    }

    function handleMouseDown(e){
        const {x, y} = getCanvasCoordinates(e);
        setSocketCoord(prev=>[...prev, {x,y}]);
        sendMessageToWebSocket('drawcontent', 'mousedown', {x,y}, noteId.id);
        setDrawing(true);
    }
    function sendMessageToWebSocket(type, mouseType, {x,y}, noteId, wholeArray){
        sendJsonMessage({
            type: type,
            mouseType: mouseType,
            coord: {x,y},
            noteId: noteId,
            wholeArray: wholeArray
        })
        console.log("message sent");
    }
    function handleMouseMove(e){
        if(drawing){
            const {x, y} = getCanvasCoordinates(e);
            setSocketCoord(prev=>[...prev, {x,y}]);
            sendMessageToWebSocket('drawcontent', 'mousemove', {x,y}, noteId.id);
        }
    }

    function handleMouseUp(e){
        const {x, y} = getCanvasCoordinates(e);
        setCoordArray(prev=>[...prev, socketCoord]);
        console.log("-> ",coordArray);
        setSocketCoord([]);
        sendMessageToWebSocket('drawcontent', 'mouseup', {x,y}, noteId.id, coordArray);

        setDrawing(false);
    }
    return (
        <div>
            <canvas 
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={style}
                ref={canvasRef}
            >
                This is canvas
            </canvas>
        </div>
    );
}

