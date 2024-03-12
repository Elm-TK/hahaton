import {$host} from "../http";
import axios from "axios";
import {Matrix} from "../types/Matrix.tsx";


export default class MatrixService {

    // получение названия всех матриц и для каждой true/false бейз матрица или нет
    static async getQuantity(){
        return new Promise((resolve) => resolve($host.get("https://65ef34f8ead08fa78a5010e6.mockapi.io/matrix")))
    }

    static async changeRowsMatrix(rows: object){
        return new Promise((resolve) => resolve($host.put("https://65ef34f8ead08fa78a5010e6.mockapi.io/matrix", {rows})))
    }

    static async getAllRows(){
        const response = await axios.get<Matrix[]>("https://65742547f941bda3f2af6834.mockapi.io/testAPI")
        return response.data
    }

    static async searchByParams(params: [string[], string[], string[]]){
        return new Promise((resolve) => resolve($host.get(`https://65ef34f8ead08fa78a5010e6.mockapi.io/matrix?${params}`)))
    }
}