import MatrixService from "../service/MatrixService.tsx";

export class Baseline {
    id: number;
    name: string;
    active: boolean;

    constructor(id: number, name: string, active: boolean) {
        this.id = id
        this.name = name
        this.active = active
    }
}

export class Discount {
    id: number;
    name: string;
    active: boolean;
    segment?: number;

    constructor(id: number, name: string, active: boolean, segment?: number) {
        this.id = id
        this.name = name
        this.active = active
        this.segment = segment
    }
}

export class SearchParams {
    id: number;
    category: string;
    location: string;
    value: number;

    constructor(id: number, category: string, location: string, price: number) {
        this.id = id
        this.category = category
        this.location = location
        this.value = price
    }
}

export class Update {
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

export class Create {
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
        let cates: string[] = []
        let loces: string[] = []
        const names: string[] = []
        const isBases: boolean[] = []

        const response = (await MatrixService.getQuantity()).data
        response.baselines.forEach((obj: Baseline) => {
            const base = new Baseline(obj.id, obj.name, obj.active)
            bases.push(base)
        })
        response.discounts.forEach((obj: Discount) => {

            const discount = new Discount(obj["id"], obj["name"], obj["active"], obj["segment"])
            discounts.push(discount)

        })

        cates = response.categories
        loces = response.locations

        unused_segments = response.unused_segments

        this.setMatricesParams(names, isBases)

        return [bases, discounts, unused_segments, cates, loces]
    }

    async createChangesMatrix(name: string, updates: Map<number, string[]>, creates: Map<number, string[]>, del: number[]) {

        const upds: Update[] = []
        const crts: Create[] = []
        updates.forEach((obj, key, map) => {
            const row = map.get(key)
            const update = new Update(key, row[0], row[1], Number(row[2]))
            upds.push(update)
        })

        creates.forEach((obj) => {
            const create = new Create(obj[0], obj[1], Number(obj[2]))
            crts.push(create)
        })

        // const changes: { name: string, updates: Update[], create: Create[], del: number[] } = {
        //     "name": name,
        //     "updates": upds,
        //     "create": crts,
        //     "del": del,
        // }

        return await MatrixService.changeRowsMatrix(name, upds, crts, del)
    }

    async getRowsByParams(params: [string, string[], string[]]) {
        const rows: SearchParams[] = []

        let parametrs: { nameMatrix: string, categories: string[], locations: string[] } = {
            "nameMatrix": params[0],
            "categories": params[1],
            "locations": params[2]
        }


        const response = await MatrixService.searchByParams(params[0], params[1], params[2])
        response.data.forEach((obj: SearchParams) => {
            const params = new SearchParams(obj.id, obj.category, obj.location, obj.value)
            rows.push(params)
        })

        // возвращаются все строки
        return rows
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