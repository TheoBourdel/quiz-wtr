import axios from 'axios';
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { Button, TextInput, Card, Label } from 'flowbite-react';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        repeatPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        console.log(formData)
        e.preventDefault();
        if (formData.username === '' || formData.password === '') {
            toast.error('Veuillez remplir tous les champs', {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }
        if (!passwordRegex.test(formData.password)) {
            toast.error('Veuillez mettre un mot de passe valide', {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }
        if (formData.password !== formData.repeatPassword) {
            toast.error('Les mots de passe ne correspondent pas', {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + 'register', {
                username: formData.username,
                password: formData.password,
                role: 'user'
            });

            if(response) {
                navigate(`/login`);
                toast.success('Vous vous êtes inscrit avec succès. Bienvenue !', {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
    

        } catch (error) {
            toast.error(error.response.data.message, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    };


    return (
            <form onSubmit={handleSubmit} className='flex max-w-md flex-col gap-4 m-auto'>
                <ToastContainer />
                <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                    Inscription
                </h1>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="username"  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" value="Pseudo" />
                    </div>
                    <TextInput 
                    onChange={handleChange}
                    value={formData.username} type="text" name="username" id="username" placeholder="pseudo" required />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password"  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" value="Mot de passe" />
                    </div>
                    <TextInput
                    onChange={handleChange}
                    value={formData.password} name="password" placeholder='••••••••' type="password" id="password" required />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="repeatPassword"  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" value="Confirmer le mot de passe" />
                    </div>
                    <TextInput 
                    onChange={handleChange}
                    value={formData.repeatPassword} type="password" name="repeatPassword" id="repeatPassword" placeholder="••••••••" required />
                </div>

                <Button type="submit">Créer un compte</Button>
                <p className="text-center text-sm font-light text-gray-500 dark:text-gray-400">
                    Vous avez déjà un compte? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Connectez-vous ici</Link>
                </p>
            </form>
    )
}