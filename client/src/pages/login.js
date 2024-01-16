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
    
    logout()

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
        <Card className='flex justify-center'>
            <form onSubmit={handleSubmit} className=' w-100'>
                <ToastContainer /> 
                <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Connexion
                </h1>
                <div className="mb-6">
                    <Label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" value="Pseudo"/>
                    <TextInput 
                    onChange={handleChange}
                    value={formData.username} name="username" type="text" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="pseudo" required />
                </div>
                <div className="mb-6">
                    <Label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" value="Mot de passe"/>
                    <TextInput 
                    onChange={handleChange}
                    value={formData.password} name="password" placeholder='••••••••' type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <Button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Se connecter</Button>
                <p className="mt-6 text-sm font-light text-gray-500 dark:text-gray-400">
                    Vous n'avez pas encore de compte? <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Inscrivez-vous ici</Link>
                </p>
            </form>
        </Card>
    )
}
