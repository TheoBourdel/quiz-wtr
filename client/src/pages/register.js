import axios from 'axios';
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {

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
            });
    
            toast.success('Vous vous êtes inscrit avec succès. Bienvenue !', {
                position: toast.POSITION.TOP_RIGHT
            });

        } catch (error) {
            toast.error(error.response.data.message, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    };


    return (
        <div className='flex justify-center '>
            <form onSubmit={handleSubmit}>
                <ToastContainer />
                <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Inscription
                </h1>
                <div className="mb-6">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pseudo</label>
                    <input 
                    onChange={handleChange}
                    value={formData.username} type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="pseudo" required />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de passe</label>
                    <input 
                    onChange={handleChange}
                    value={formData.password} name="password" placeholder='••••••••' type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div>
                    <label htmlFor="repeatPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmer le mot de passe</label>
                    <input 
                    onChange={handleChange}
                    value={formData.repeatPassword} type="password" name="repeatPassword" id="repeatPassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                </div>
                <button type="submit" className="mt-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Créer un compte</button>
                <p className="mt-6 text-sm font-light text-gray-500 dark:text-gray-400">
                    Vous avez déjà un compte? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Connectez-vous ici</Link>
                </p>
            </form>
        </div>
    )
}