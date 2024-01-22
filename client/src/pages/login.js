import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import { Button, Label, TextInput, Card} from 'flowbite-react';


export default function Login() {
    const navigate = useNavigate();
    const { login, logout } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const success = await login(formData.username, formData.password);
            console.log(success)
            if (success) {
                toast.success('Vous êtes Connecté !', {
                    position: toast.POSITION.TOP_RIGHT
                });
                navigate("/");
            }
        } catch (error) {
            toast.error("Username ou mot de passe incorrect", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    };

    return (
            <form onSubmit={handleSubmit} className='flex max-w-md flex-col gap-4 m-auto'>
                <ToastContainer /> 
                <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                    Connexion
                </h1>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" value="Pseudo"/>
                    </div>
                    <TextInput 
                    onChange={handleChange}
                    value={formData.username} name="username" type="text" id="username" placeholder="pseudo" required />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" value="Mot de passe"/>
                    </div>
                    <TextInput 
                    onChange={handleChange}
                    value={formData.password} name="password" placeholder='••••••••' type="password" id="password" required />
                </div>
                <Button type="submit">Se connecter</Button>

                <p className="text-center text-sm font-light text-gray-500 dark:text-gray-400">
                    Vous n'avez pas encore de compte? <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Inscrivez-vous ici</Link>
                </p>
            </form>
    )
}
