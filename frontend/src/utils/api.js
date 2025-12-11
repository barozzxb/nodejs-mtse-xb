import axios from './axios.customize';
import { jwtDecode } from 'jwt-decode';

export const createUserAPI = (name, email, password) => {
    const URL_API = "/api/v1/register";
    const data = {
        name, email, password
    }
    return axios.post(URL_API, data)
};

export const loginAPI = (email, password) => {
    const URL_API = "/api/v1/login";
    const data = {
        email, password
    }
    return axios.post(URL_API, data)
}

export const getUserAPI = () => {
    const URL_API = "/api/v1/user";
    return axios.get(URL_API)
}

export const orderAPI = (items) => {

    const token = localStorage.getItem('access_token').toString();
    if (!token){
        console.error("Invalid token");
        return;
    }    
    const id = jwtDecode(token).userID;
    const res = axios.post('/api/v1/orders/make', {
        userId: id,
        items
    });
    return res;
}