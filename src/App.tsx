import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import MainPage from "./components/MainPage.tsx";
function App() {
    return (
        <>
            <MainPage/>
            {/*<div>*/}
            {/*    <Routes>*/}
            {/*        <Route path="/" element={<MainPage/>}/>*/}
            {/*        <Route path="*" element={<Navigate to="/"/>}/>*/}
            {/*    </Routes>*/}
            {/*</div>*/}
        </>
    )
}

export default App
