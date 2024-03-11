import SearchParamsService from "../service/SearchParamsService.tsx";

export default class SearchParamsStore {
    private _Ids: number[];
    private _Categories: string[];
    private _Locations: string[];

    constructor() {
        this._Ids = []
        this._Categories = []
        this._Locations = []
    }


    async getSearchParams() {
        let ids: number[] = []
        let categories: string[] = []
        let locations: string[] = []

        const response = await SearchParamsService.getForSearch()
        response.data.forEach((option) => {
            ids.push(option["id"])
            categories.push(option["category"])
            locations.push(option["location"])
        })

        this.setSearchParams(ids, categories, locations)
        return([ids, categories, locations])
    }


    setSearchParams(ids: number[], categories: string[], locations: string[]) {
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