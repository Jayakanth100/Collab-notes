import {Routes, Route, Navigate} from 'react-router-dom'

import Note from "./Components/note"
import Home from "./Components/home"

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/new-note/:id" element={<Note/>} />
                <Route path="*" element= {<Navigate to="/" />} />
            </Routes>
        </>
    )
}
export default App
