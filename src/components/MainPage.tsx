import Table from "./Table.tsx";
import Search from "./Search.tsx";
import Segments from "./Segments.tsx";

const MainPage = () => {
    return (
        <div className="flex flex-col mx-auto w-[1024px]">
            {/*<Segments/>*/}
            <div className="mt-16">
                <Search/>
            </div>
        </div>
    )
}
export default MainPage;