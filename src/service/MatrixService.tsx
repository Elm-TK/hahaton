import {$host} from "../http";


export default class MatrixService {

    // получение названия всех матриц и для каждой true/false бейз матрица или нет
    static async getQuantity(){
        return new Promise((resolve) => resolve($host.get("https://65ef34f8ead08fa78a5010e6.mockapi.io/matrix")))
    }

    static async changeRowsMatrix(rows: object){
        return new Promise((resolve) => resolve($host.put("https://65ef34f8ead08fa78a5010e6.mockapi.io/matrix", {rows})))
    }
}