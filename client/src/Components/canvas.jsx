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
    useEffect(()=>{
        if(drawn !== undefined){
            draw(mouseType,drawn.x,drawn.y);
            console.log("Received");
        }
    },[drawn]);
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

    useEffect(()=>{
        console.log("Im join client");
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
        console.log("Hello: ", prevCoordArray);
    }, []);

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

    useEffect(()=>{
        if(socketCoord !== undefined && socketCoord.length){
            let array = socketCoord;
            let len = array.length;
            let {x,y,type} = array[len-1];
            console.log("The coord are: ", socketCoord);
            console.log("The whole array :", coordArray);
            if(type === 'mouseup'){
                console.log("Mouseup executed");
                sendMessageToWebSocket('drawcontent', type, {x,y}, noteId.id, coordArray );
                setSocketCoord([]);
            }
            else{
                sendMessageToWebSocket('drawcontent', type, {x,y}, noteId.id);
            }

        }
    },[socketCoord]);

    function handleMouseDown(e){
        const {x, y} = getCanvasCoordinates(e);
        let obj = {x: x,y: y, type: 'mousedown'};
        setSocketCoord(prev=>[...prev, obj]);
        setDrawing(true);
    }

    function handleMouseMove(e){
        if(drawing){
            const {x, y} = getCanvasCoordinates(e);
            setSocketCoord(prev=>[...prev, {x: x,y: y, type: 'mousemove'}]);
        }
    }

    function handleMouseUp(e){
        const {x, y} = getCanvasCoordinates(e);
        console.log("dei: ", x,y);
        setSocketCoord(prev=>[...prev, {x: x,y: y, type: 'mouseup'}]);
        setCoordArray(prev=>[...prev, socketCoord]);
        // setSocketCoord(prev=>[...prev, {x: x,y: y, type: 'mouseup'}]);
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

