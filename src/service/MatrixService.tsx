import {$host} from "../http";
import {Create, StorageDiscount, Update} from "../store/MatrixStore.tsx";


export default class MatrixService {

    // получение названия всех матриц и для каждой true/false бейз матрица или нет
    static async getQuantity() {
        return new Promise((resolve) => resolve($host.get("api/main/generateClient")))
    }

    static async changeRowsMatrix(name: string, updates: Update[], create: Create[], del: number[]) {
        return new Promise((resolve) => resolve($host.put("api/matrix/update", {name, updates, create, del})))
    }

    static async searchByParams(nameMatrix: string, categories: string[], locations: string[]) {
        return new Promise((resolve) => resolve($host.post(`api/matrix/get`, {nameMatrix, categories, locations})))
    }

    static async createStorage(id: number, active: number[], upSeg: StorageDiscount[]){
        return new Promise((resolve) => resolve($host.put("api/main/configureServer",{id,active,upSeg})))
    }

    static async changePrice(name: string, ids:number[],operator: string, value: number){
        return new Promise((resolve) => resolve($host.put("api/matrix/increase",{name, ids, operator,value})))
    }
}
