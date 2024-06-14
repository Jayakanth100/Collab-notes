import {Routes, Route, Navigate} from 'react-router-dom'
import styles from "./App.module.css"
import Sidebar from "./Components/Sidebar/Sidebar"
import Note from "./Components/Note/note"
import Home from "./Components/Home/home"

function App() {
    return (
        <div className={styles.appContainer}>
            <Sidebar/>
            <div className={styles.routerContainer}>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/new-note/:id" element={<Note/>} />
                    <Route path="*" element= {<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    )
}
export default App
