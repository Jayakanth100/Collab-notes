import React, { useEffect, useRef, useState } from "react";
// import pic from "../../assets/x.jpg"
export default function Canvas({sendJsonMessage,lastJsonMessage,noteId,style, joinClient}){

    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    const sampleCanvas = useRef(null);
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

    useEffect(()=> {
        if(socketCoord !== undefined && socketCoord.length){
            let array = socketCoord;
            let len = array.length;
            let {x,y,type} = array[len-1];
            console.log("The coord are: ", socketCoord);
            console.log("The whole array :", coordArray);
            if(type === 'mouseup'){
                console.log("Mouseup executed");
                sendMessageToWebSocket('drawcontent', type, {x,y}, noteId.id, coordArray);
                setSocketCoord([]);
            }
            else{
                sendMessageToWebSocket('drawcontent', type, {x,y}, noteId.id);
            }
        }
    },[socketCoord]);

    useEffect(()=>{
        if(drawn !== undefined){
            draw(mouseType,drawn.x,drawn.y);
            console.log("Received");
        }
    },[drawn]);

    useEffect(()=>{
        console.log("Im join client");
        if(prevCoordArray !== undefined){
            console.log("Hello coords: ", prevCoordArray);
            Prevdraw(prevCoordArray);
        }
    },[prevCoordArray]);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        canvas.width = window.innerWidth - rect.left;
        canvas.height = window.innerHeight - rect.top;
        ctx.strokeStyle = "red";
        contextRef.current = ctx;
        fetchBlob(ctx);
    }, []);

    function fetchBlob(){
        console.log("Calling fetch blop: ", noteId);
        fetch(`http://localhost:3000/api/blop?noteId=${noteId}`,{
            method: 'GET',
        })
            .then((res)=>{
                console.log("Blop resposne is: ",res);
                return res.blob();
            })
            .then((blob)=>{drawBlobOnCanvas(blob)})
            .catch((err)=>{
                console.log("Error while fetching blop in clientSide: ", err)
            })
    }

    function drawBlobOnCanvas(blob){
        console.log("drawing: ", blob);
        let img = new Image();
        const url = URL.createObjectURL(blob);
        img.src = url;
        img.onload=()=>{
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0,0);
            URL.revokeObjectURL(url);
        };
    }
    // useEffect(()=>{
    //     const canvas = sampleCanvas.current;
    //     if(!canvas){return;}
    //     const ctx = canvas.getContext('2d');
    //     const img = new Image();
    //     img.onload = ()=>{
    //         ctx.drawImage(img,4,4);
    //     }
    //     img.onerror = (error)=>{
    //         console.log("Error loading image: ", error);
    //     }
    //     img.src = pic;
    //     canvas.toBlob((blob)=>{
    //         console.log(blob);
    //         const url = URL.createObjectURL(blob);
    //         console.log("The url is: ",url);
    //         imgRef.current.onload = ()=>{
    //             URL.revokeObjectURL();
    //         }
    //         imgRef.current.src = url; 
    //     })
    // },[])
    

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
            console.log("Mouse down");
            contextRef.current.beginPath();
            contextRef.current.moveTo(x, y);
        }
        else if(type === "mousemove"){
            console.log("Mouse move");
            contextRef.current.lineTo(x, y);
            contextRef.current.stroke();
        }
        else{
            contextRef.current.closePath();
        }
    }

    function Prevdraw(coords){
        for(let i = 0; i < coords.length; i++){
            contextRef.current.beginPath();
            for(let j = 0; j < coords[i].length; j++){
                let {x,y} = coords[i][j];
                if(j === 0){
                    contextRef.current.moveTo(x,y);
                }
                else{
                    contextRef.current.lineTo(x,y);
                    contextRef.current.stroke();
                }
            }
            contextRef.current.closePath();
        }
        console.log("Thats it");
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

    function saveCanvas() {
       const data = canvasRef.current.toBlob((blob)=>{
            const url = URL.createObjectURL(blob);
            console.log("The noteId is: ",noteId);
            console.log(url);
            console.log("Sending blob object: ",blob);
            fetch("http://localhost:3000/api/image",{
                method: 'POST',
                headers: {
                    'Note-Id': noteId,
                    'Content-Type': 'application/octet-stream',
                },
                body: blob 
            })
            .then((res)=>{
                console.log(res);
            })
            .catch(err=>{console.log(err)});
        }); 
        console.log(data);
    }

    return (
        <div>
            <img ref={imgRef} src="" alt=""/>
            <canvas
                style={
                    {
                        width: "100px",
                        height: "100px",
                        border: "2px solid red"
                    }
                }
                ref={sampleCanvas}
            ></canvas>
            <button onClick={saveCanvas}>save</button>
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

