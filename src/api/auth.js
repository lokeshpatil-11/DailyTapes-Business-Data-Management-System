import axios from 'axios';
import { auth_token, WEB_URL } from './'

const PRE_URL = WEB_URL + '/authrequest/';

export const register = async (body) => {
    try {
        const res = await axios
            .post(PRE_URL + `register`, body);
        return res;
    } catch (err) {
        return err;
    }
};

export const login = async (body) => {
    try {
        const res = await axios
            .post(PRE_URL + `login`, body);
        return res;
    } catch (err) {
        return err;
    }
};

export const verifyAuthSession = () => {
    if (auth_token.headers.Authorization === null) {
        if (!window.location.pathname.includes('/auth/')) {
            alert('Please Log In First..!')
            localStorage.clear();
            window.location = process.env.PUBLIC_URL + '/auth/login'
            return null;
        }
        return true;
    } else {
        return axios
            .get(PRE_URL + `verifyauthsession`, auth_token)
            .then(res => {
                if (res.data.status === 'success') {
                    return true;
                } else {
                    alert('User Token Expired. Please log in again')
                    localStorage.clear();
                    window.location = process.env.PUBLIC_URL + '/auth/login'
                    return null;
                }
            })
            .catch((err) => {
                alert('User Token Expired. Please log in again')
                localStorage.clear();
                window.location = process.env.PUBLIC_URL + '/auth/login'
                return null;
            })
    }
};