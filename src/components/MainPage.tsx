import Table from "./Table.tsx";
import Search from "./Search.tsx";
import Segments from "./Segments.tsx";

const MainPage = () => {
    return (
        <div className="flex flex-col mx-auto w-[1024px]">
            <Segments/>
            <div className="flex  mt-16">
                <Search/>
                <Table/>
            </div>
        </div>
    )
}
export default MainPage;