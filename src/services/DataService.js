import axios from "axios";

const VITE_API = import.meta.env.VITE_API;
class DataService {
    getData(){
        return axios.get(
            VITE_API+'/api',
        )
    }
}

export default new DataService();