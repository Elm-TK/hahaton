import MatrixService from "../service/MatrixService.tsx";

export default class MatrixStore {
    private _IsBase: boolean[];
    private _Names: string[];

    constructor() {
        this._Names = []
        this._IsBase = []
    }

    async getQuantityMatrices() {
        const names: string[] = []
        const isBases: string[] = []

        const response = await MatrixService.getQuantity()

        response.data.forEach((option) => {
            names.push(option["name"])
            isBases.push(option["isBase"])
        })

        this.setMatricesParams(names, isBases)

        return [names, isBases]
    }

    async createChangesMatrix(rows: object) {
        return await MatrixService.changeRowsMatrix(rows)
    }

    async getRowsByParams(params: [string[], string[], string[]]) {
        const ids: number[] = []
        const categories: string[] = []
        const locations: string[] = []
        const values: string[] = []

        const response = await MatrixService.searchByParams(params)

        response.data.forEach((option) => {
            ids.push(option["id"])
            categories.push(option["category"])
            locations.push(option["location"])
            values.push(option["value"])
        })
        return [ids, categories, locations, values]
    }

    async getAllRows() {
        return await MatrixService.getAllRows()
    }

    setMatricesParams(names: string[], isBases: boolean[]) {
        this._Names = names
        this._IsBase = isBases
    }

    get matrixIsBase() {
        return this._IsBase
    }

    get matrixName() {
        return this._Names
    }

}