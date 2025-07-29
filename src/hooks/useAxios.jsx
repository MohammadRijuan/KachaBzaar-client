import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `https://kacha-bazaar-server.vercel.app`
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;