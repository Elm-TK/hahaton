import {$host} from "../http";
import axios from "axios";
import {Matrix} from "../types/Matrix.tsx";


export default class MatrixService {

    // получение названия всех матриц и для каждой true/false бейз матрица или нет
    static async getQuantity() {
        return new Promise((resolve) => resolve($host.get("api/main/generateClient")))
    }

    static async changeRowsMatrix(changes: string) {
        return new Promise((resolve) => resolve($host.put("https://65ef34f8ead08fa78a5010e6.mockapi.io/matrix", {changes})))
    }

    static async getAllRows() {
        const response = await axios.get<Matrix[]>("https://65742547f941bda3f2af6834.mockapi.io/testAPI")
        return response.data
    }

    static async searchByParams(nameMatrix: string, categories: string[], locations: string[]) {
        return new Promise((resolve) => resolve($host.post(`api/matrix/get`, {nameMatrix, categories, locations})))
    }
}
