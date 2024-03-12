import MatrixService from "../service/MatrixService.tsx";

export default class MatrixStore {
    private _IsBase: boolean[];
    private _Names: string[];

    constructor() {
        this._Names = []
        this._IsBase = []
    }

    async getQuantityMatrices() {
        let names: string[] = []
        let isBases: boolean[] = []

        const response = await MatrixService.getQuantity()

        response.data.forEach((option) => {
            names.push(option["name"])
            isBases.push(option["isBase"])
        })

        this.setMatricesParams(names, isBases)

        return [names, isBases]
    }

    async createChangesMatrix(rows: object){
        return await  MatrixService.changeRowsMatrix(rows)
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