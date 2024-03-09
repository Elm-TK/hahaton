import './App.css'
import MainPage from "./components/MainPage.tsx";
import Header from "./components/Header.tsx";
function App() {
    return (
        <>
            <Header/>
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
