import axios from './axios.customize';

export const createUserAPI = (name, email, password) => {
    const URL_API = "/register";
    const data = {
        name, email, password
    }
    return axios.post(URL_API, data)
};

export const loginAPI = (email, password) => {
    const URL_API = "/login";
    const data = {
       email, password
    }
    return axios.post(URL_API, data)
}

export const getUserAPI = () => {
    const URL_API = "/user";
    return axios.post(URL_API)
}

