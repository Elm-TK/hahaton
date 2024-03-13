import MatrixService from "../service/MatrixService.tsx";

class Baseline {
    id: number;
    name: string;
    active: boolean;

    constructor(id: number, name: string, active: boolean) {
        this.id = id
        this.name = name
        this.active = active
    }
}

class Discount {
    id: number;
    name: string;
    active: boolean;
    segment?: number[];

    constructor(id: number, name: string, active: boolean, segment?: number[]) {
        this.id = id
        this.name = name
        this.active = active
        this.segment = segment
    }
}

class SearchParams {
    id?: number;
    category?: string;
    location?: string;
    price?: number;

    constructor(id: number | undefined, category: string | undefined, location: string | undefined, price: number | undefined) {
        this.id = id
        this.category = category
        this.location = location
        this.price = price
    }
}

class Update {
    id: number;
    category: string | undefined;
    location: string | undefined;
    price: number | undefined;

    constructor(id: number, category: string | undefined, location: string | undefined, price: number | undefined) {
        this.id = id
        this.category = category
        this.location = location
        this.price = price

    }
}

class Create {
    category: string;
    location: string;
    price: number;

    constructor(category: string, location: string, price: number) {
        this.category = category
        this.location = location
        this.price = price
    }
}

export default class MatrixStore {
    private _IsBase: boolean[];
    private _Names: string[];

    constructor() {
        this._Names = []
        this._IsBase = []
    }

    async getQuantityMatrices() {
        const bases: Baseline[] = []
        const discounts: Discount[] = []
        let unused_segments: number[] = []
        const names: string[] = []
        const isBases: boolean[] = []

        const response = await MatrixService.getQuantity()

        response.data.baseline.forEach((obj: Baseline) => {
            const base = new Baseline(obj["id"], obj["name"], obj["active"])
            bases.push(base)
        })

        response.data.discounts.forEach((obj: Discount) => {
            const discount = new Discount(obj["id"], obj["name"], obj["active"], obj["segment"])
            discounts.push(discount)
        })

        unused_segments = response.data.unused_segments

        this.setMatricesParams(names, isBases)

        return [bases, discounts, unused_segments]
    }

    async createChangesMatrix(name: string, updates: Map<number, string[]>, creates: Map<number, string[]>, del: number[]) {

        const upds: Update[] = []
        const crts: Create[] = []
        updates.forEach
        ((obj, key, map) => {
            const row = map.get(key)
            const update = new Update(key, row[0], row[1], Number(row[2]))
            upds.push(update)
        })

        creates.forEach((obj) => {
            const create = new Create(obj[0], obj[1], Number(obj[2]))
            crts.push(create)
        })

        const changes: { name: string, updates: Update[], create: Create[], del: number[] } = {
            "name": name,
            "updates": upds,
            "create": crts,
            "del": del,
        }

        let json = JSON.stringify(changes)

        console.log(json)
        return await MatrixService.changeRowsMatrix(json)
    }

    async getRowsByParams(params: [string, number[], string[], string[]]) {
        const rows: SearchParams[] = []

        let parametrs: { name: string, ids: number[], categories: string[], locations: string[] } = {
            "name": params[0],
            "ids": params[1],
            "categories": params[2],
            "locations": params[3]
        }

        let json = JSON.stringify(parametrs)


        const response = await MatrixService.searchByParams(json)

        response.data.forEach((obj: SearchParams) => {
            const params = new SearchParams(obj["id"], obj["category"], obj["location"], obj["price"])
            rows.push(params)
        })

        // возвращаются все строки

        return rows
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