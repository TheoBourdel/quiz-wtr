import React, { createContext, useContext, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    const login = (username, password) => {
        try {
            return axios.post(process.env.REACT_APP_API_URL + 'login', {
                username: username,
                password: password,
            }).then(res => {
                if(res && res.data) {
                    setUser(res.data.user)
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    return true;
                } else {
                    return false;
                }
            });

        } catch (error) {
            toast.error(error.response.data.message, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    };

    const logout = () => {
        // Logique de déconnexion
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
