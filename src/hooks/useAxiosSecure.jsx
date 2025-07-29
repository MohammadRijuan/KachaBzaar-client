import axios from 'axios';

const axiosSecure = axios.create({
    baseURL: `https://kacha-bazaar-server.vercel.app`
});

const useAxiosSecure = () => {
    return axiosSecure;
};

export default useAxiosSecure;