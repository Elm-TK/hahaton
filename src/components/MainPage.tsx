import Table from "./Table.tsx";
import Search from "./Search.tsx";

const MainPage = () => {
    return (
        <div className="flex">
            <div className="flex flex-col mt-16 mx-auto w-[1024px]">
                <Search/>
                <Table/>
            </div>
        </div>
    )
}
export default MainPage;