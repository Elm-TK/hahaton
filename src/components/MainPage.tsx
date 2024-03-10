import Table from "./Table.tsx";
import Filters from "./Filters.tsx";

const MainPage = () => {
    return (
        <div className="flex">
            <div className="flex flex-col mt-16 mx-auto w-[1024px]">
                <Filters/>
                <Table/>
            </div>
        </div>
    )
}
export default MainPage;