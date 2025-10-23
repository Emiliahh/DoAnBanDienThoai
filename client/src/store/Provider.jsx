import Context from './Context';
import CryptoJS from 'crypto-js';

import cookies from 'js-cookie';

import { useEffect, useState } from 'react';
import { requestAuth, requestGetAllCategory, requestGetCart } from '../Config/request';

export function Provider({ children }) {
    const [dataUser, setDataUser] = useState({});

    const [dataCategory, setDataCategory] = useState([]);
    const [dataCart, setDataCart] = useState([]);

    const fetchAuth = async () => {
        const res = await requestAuth();
        const bytes = CryptoJS.AES.decrypt(res.metadata.auth, import.meta.env.VITE_SECRET_CRYPTO);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        const user = JSON.parse(originalText);
        setDataUser(user);
    };

    const fetchCategory = async () => {
        const res = await requestGetAllCategory();
        setDataCategory(res.metadata);
    };

    const fetchCart = async () => {
        const res = await requestGetCart();
        setDataCart(res.metadata);
    };

    useEffect(() => {
        const token = cookies.get('logged');
        fetchCategory();
        if (!token) {
            return;
        }
        fetchAuth();
        fetchCart();
    }, []);

    return (
        <Context.Provider
            value={{
                dataUser,
                fetchAuth,
                dataCategory,
                dataCart,
                fetchCategory,
                fetchCart,
            }}
        >
            {children}
        </Context.Provider>
    );
}
