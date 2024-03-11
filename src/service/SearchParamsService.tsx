import axios from "axios";

export const $host = axios.create({
    baseURL: "https://65742547f941bda3f2af6834.mockapi.io",

})

export default class SearchParamsService {
    static async getForSearch() {
        // const response = await axios.get<User[]>("https://65742547f941bda3f2af6834.mockapi.io/catLoc")

        return new Promise((resolve) => resolve($host.get(`https://65742547f941bda3f2af6834.mockapi.io/catLoc`)))
    }
}
