import axios from "axios";
import {User} from "../types/Matrix.tsx";

export default class CountryService {
    static async getForSearch() {
        const response = await axios.get<User[]>("https://65742547f941bda3f2af6834.mockapi.io/catLoc")

        return response.data
    }

    static async getAll() {
        const response = await axios.get<User[]>("https://65742547f941bda3f2af6834.mockapi.io/testAPI")
        return response.data
    }
}