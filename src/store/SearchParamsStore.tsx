import SearchParamsService from "../service/SearchParamsService.tsx";

export default class SearchParamsStore {
    private _Ids: string[];
    private _Categories: string[];
    private _Locations: string[];

    constructor() {
        this._Ids = []
        this._Categories = []
        this._Locations = []
    }


    async getSearchParams(selectedMatrix: string) {
        const ids: string[] = []
        const categories: string[] = []
        const locations: string[] = []

        const response = await SearchParamsService.getForSearch(selectedMatrix)
        response.data.forEach((option) => {
            ids.push(option["id"])
            categories.push(option["category"])
            locations.push(option["location"])
        })

        this.setSearchParams(ids, categories, locations)
        return([ids, categories, locations])
    }


    setSearchParams(ids: string[], categories: string[], locations: string[]) {
        this._Ids = ids
        this._Categories = categories
        this._Locations = locations
    }

    get searchIds() {
        return this._Ids
    }

    get searchCategories() {
        return this._Categories
    }

    get searchLocations() {
        return this._Locations
    }
}