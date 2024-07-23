import {Routes, Route, Navigate} from 'react-router-dom'
import styles from "./App.module.css"
import Sidebar from "./Components/Sidebar/Sidebar"
import Note from "./Components/Note/note"
import Home from "./Components/Home/home"
import Login from "./Components/Login/Login"
import SignIn from "./Components/SignIn/SignIn"

function App() {
    return (
        <div className={styles.appContainer}>
            <Sidebar/>
            <div className={styles.routerContainer}>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/login" element={<Login/>}></Route>
                    <Route path="/signin" element={<SignIn/>}></Route>
                    <Route path="/new-note/:id" element={<Note/>} />
                    <Route path="*" element= {<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    )
}
export default App
