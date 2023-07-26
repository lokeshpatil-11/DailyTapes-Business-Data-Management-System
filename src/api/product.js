import axios from 'axios';
import { auth_token, WEB_URL } from './'

const PRE_URL = WEB_URL + '/productrequest/';

export const addProductCard = async (body) => {
    try {
        const res = await axios
            .post(PRE_URL + `addproductcard`, body, auth_token);
        return res;
    } catch (err) {
        return err;
    }
};

export const fetchProductCards = async () => {
    try {
        const res = await axios
            .get(PRE_URL + `fetchproductcards`, auth_token);
        return res;
    } catch (err) {
        return err;
    }
};
