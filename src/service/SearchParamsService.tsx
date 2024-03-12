import {$host} from "../http";


export default class SearchParamsService {
    static async getForSearch() {
        return new Promise((resolve) => resolve($host.get(`https://65742547f941bda3f2af6834.mockapi.io/catLoc`)))
    }
}
