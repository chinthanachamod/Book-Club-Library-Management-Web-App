/*
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { login } from "../services/authService";
import {useAuth} from "../context/useAuth.ts";
import loginBook from '../assets/loginBook.png';

export interface LoginFormData {
    email: string
    password: string
}

interface FormErrors {
    email?: string
    password?: string
}

const Login = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { login: authenticate } = useAuth()

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            setIsLoading(true)
            try {
                const user = await login(formData)
                toast.success(`Welcome, ${user.name}!`)
                authenticate(user.accessToken)
                navigate("/dashboard") // <-- or wherever you want to go after login
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.message)
                } else {
                    toast.error("Something went wrong")
                }
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }))
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc] relative overflow-hidden">
            {/!* Decorative Image Left *!/}
            <div className="absolute top-0 left-0 w-1/2 h-full opacity-30 pointer-events-none z-0 flex items-center justify-center">
                <img
                    src={loginBook}
                    alt="Books left"
                    className="max-h-[90%] object-contain"
                />
            </div>

            {/!* Decorative Image Right *!/}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none z-0 flex items-center justify-center">
                <img
                    src={loginBook}
                    alt="Books right"
                    className="max-h-[90%] object-contain transform scale-x-[-1]"
                />
            </div>

            {/!* Login form *!/}
            <div className="relative z-10 via-fuchsia-100/30 backdrop-blur-md rounded-2xl shadow-xl p-10 w-full max-w-md border border-purple-200/50">
                <h2 className="text-2xl font-bold text-center mb-6 text-purple-800">Login to Your Account</h2>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/!* Email Field *!/}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className={`mt-1 block w-full px-4 py-2 rounded-lg shadow-inner bg-purple-50 border ${
                                    errors.email ? "border-red-400" : "border-purple-300"
                                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition duration-200 sm:text-sm`}
                            />
                            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                        </div>

                        {/!* Password Field *!/}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={`mt-1 block w-full px-4 py-2 rounded-lg shadow-inner bg-purple-50 border ${
                                    errors.password ? "border-red-400" : "border-purple-300"
                                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition duration-200 sm:text-sm`}
                            />
                            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                        </div>
                    </div>

                    {/!* Submit *!/}
                    <div>
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
                        >
                            {!isLoading ? "Sign in" : "Signing in..."}
                        </button>
                    </div>

                    {/!* Redirect *!/}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                            >
                                Create new account
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login*/
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../services/ApiClient';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiClient.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-blue-800 mb-2">Welcome Back</h1>
                        <p className="text-blue-600">Sign in to your Book-Club account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-blue-700">
                                Email Address
                            </label>
                            <motion.div whileHover={{ scale: 1.01 }} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-blue-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="your@email.com"
                                    required
                                />
                            </motion.div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-blue-700">
                                Password
                            </label>
                            <motion.div whileHover={{ scale: 1.01 }} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-blue-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </motion.div>
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-blue-600">
                            Don't have an account?{' '}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/signup')}
                                className="font-medium text-blue-700 hover:underline"
                            >
                                Sign up
                            </motion.button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;