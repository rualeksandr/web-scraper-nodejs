import axios from "axios";


export default function apiService() {
    const post = async (url, data, options) => {
        const { data: res } = await axios.post(url, data, options);
        return res;
    }

    return {
        post,
    }
}