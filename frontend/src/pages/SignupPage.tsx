/*
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signup } from "../services/authService"
import toast from "react-hot-toast"
import axios from "axios"
import loginBook from '../assets/loginBook.png';

interface FormData {
    name: string
    email: string
    password: string
    confirmPassword: string
}

interface FormErrors {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
}

const Signup = () => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate() // <-- for navigation

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // Name validation
        if (!formData.name) {
            newErrors.name = "Name is required"
        } else if (formData.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters"
        }

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

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            setIsLoading(true)
            try {
                await signup({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                })
                toast.success("Signup successful! Please login.")
                navigate("/login") // <-- navigate to login on success
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
                <img src={loginBook} alt="Books left" className="max-h-[90%] object-contain" />
            </div>

            {/!* Decorative Image Right *!/}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none z-0 flex items-center justify-center">
                <img src={loginBook} alt="Books right" className="max-h-[90%] object-contain transform scale-x-[-1]" />
            </div>

            {/!* Signup Form *!/}
            <div className="relative z-10 bg-purple-100/30 backdrop-blur-md rounded-2xl shadow-xl p-10 w-full max-w-md border border-purple-200/50">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-purple-800">Create your account</h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/!* Full Name *!/}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className={`mt-1 block w-full px-4 py-2 rounded-lg shadow-inner bg-purple-50 border ${
                                    errors.name ? "border-red-400" : "border-purple-300"
                                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition duration-200 sm:text-sm`}
                            />
                            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                        </div>

                        {/!* Email *!/}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
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

                        {/!* Password *!/}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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

                        {/!* Confirm Password *!/}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className={`mt-1 block w-full px-4 py-2 rounded-lg shadow-inner bg-purple-50 border ${
                                    errors.confirmPassword ? "border-red-400" : "border-purple-300"
                                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition duration-200 sm:text-sm`}
                            />
                            {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    {/!* Sign Up Button *!/}
                    <div>
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
                        >
                            {!isLoading ? "Sign up" : "Signing up..."}
                        </button>
                    </div>

                    {/!* Redirect to Login *!/}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup*/
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../services/ApiClient';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        setLoading(true);

        try {
            await apiClient.post('/auth/register', { name, email, password });
            toast.success('Account created successfully! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
                        <h1 className="text-3xl font-bold text-blue-800 mb-2">Create Account</h1>
                        <p className="text-blue-600">Join Book-Club to manage your library</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-blue-700">
                                Full Name
                            </label>
                            <motion.div whileHover={{ scale: 1.01 }} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-blue-400" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="John Doe"
                                    required
                                />
                            </motion.div>
                        </div>

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

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-700">
                                Confirm Password
                            </label>
                            <motion.div whileHover={{ scale: 1.01 }} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-blue-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                                    Creating Account...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-blue-600">
                            Already have an account?{' '}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/login')}
                                className="font-medium text-blue-700 hover:underline"
                            >
                                Sign in
                            </motion.button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;