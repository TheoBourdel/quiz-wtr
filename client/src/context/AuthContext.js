import React, { createContext, useContext, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (username, password) => {
        try {
            return axios.post(process.env.REACT_APP_API_URL + 'login', {
                username: username,
                password: password,
            }).then(res => {
                if(res && res.data) {
                    console.log(res.data.user)
                    setUser(res.data.user)
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
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
