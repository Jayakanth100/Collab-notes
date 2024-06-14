import sideCloser from "../../assets/next.png"
import { CgNotes } from "react-icons/cg";
import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./Sidebar.module.css"

export default function Sidebar(){
    const sideBarRef = useRef(null);
    const [sidebarWidth, setSidebarWidth] = useState(150);
    const [isResizing, setIsResizing] = useState();
    const sideBarButtonRef = useRef(null);
    const [sideBarOpen, setSideBarOpen] = useState(true);
    const sideBarResizeRef = useRef(null);
    const closerImgRef = useRef(null);

    const startResizing = useCallback(()=>{
        sideBarRef.current.classList.add(styles.notransition);
        setIsResizing(true);
    },[]);

    const stopResizing = useCallback(()=>{
        sideBarRef.current.classList.remove(styles.notransition);
        setIsResizing(false);
    },[]);

    const resize = useCallback((mouseMoveEvent)=>{
        if(isResizing){
            setSidebarWidth(
                mouseMoveEvent.clientX - 
                    sideBarRef.current.getBoundingClientRect().left
            );
        }
    },[isResizing]);

    useEffect(()=>{
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return()=>{
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        }
    },[resize, stopResizing]);

    function handleCloser(){
        if(sideBarOpen){
            closerImgRef.current.style.transform = 'rotate(180deg)'
            setSidebarWidth(30);
            setSideBarOpen(false);
            sideBarResizeRef.current.style.display = "none";
        }
        else{
            closerImgRef.current.style.transform = 'rotate(360deg)'
            setSidebarWidth(150);
            setSideBarOpen(true);
            sideBarResizeRef.current.style.display = "inline-flex";
        }
    }
    function handleAllNotes(e){
        e.preventDefault();
    }
    return(
        <div
            className={styles.sidebar}
            ref={sideBarRef}
            style={{width: sidebarWidth}}
            onMouseDown={(e)=>e.preventDefault()}>

            <div className={styles.sidebarContent}>
                <button onClick={handleCloser} ref={sideBarButtonRef} className={styles.sideCloser}>
                    <img 
                        ref={closerImgRef}
                        className={styles.closer}
                        src={sideCloser}
                        alt="sideCloser"/>
                </button>
                <div className={styles.contentList}>
                    <ul>
                        <li>
                            <div onClick={handleAllNotes} className={styles.listItem}>
                                <CgNotes className={styles.listIcons}/>
                                <span>All notes</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div
                className={styles.sidebarResizer}
                ref={sideBarResizeRef}
                onMouseDown={startResizing}
            ></div>
        </div>
    )
}
