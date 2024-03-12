import {$host} from "../http";


export default class MatrixService {
    static async getQuantity(){
        return new Promise((resolve) => resolve($host.get("https://65ef34f8ead08fa78a5010e6.mockapi.io/matrix")))
    }
}