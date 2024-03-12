import axios from "axios"


const $host = axios.create({
    baseURL: import.meta.env.API_URL

})

export {
    $host
}
