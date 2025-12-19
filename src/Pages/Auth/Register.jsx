import React, { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import Google from './Google';
import axios from 'axios';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { AuthContext } from '../../Context/AuthContext';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import toast from 'react-hot-toast';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { registerUser, updateUserProfile } = use(AuthContext);
    const [show, setShow] = useState(false)
    const location = useLocation();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure()



    const handleRegister = (data) => {
        const userImg = data.photo[0];


        console.log(data);

        registerUser(data.email, data.password)
            .then(() => {
                // const user = result.user;
                // console.log(user);

                // store the image to imgbb server
                const formData = new FormData();
                formData.append('image', userImg)

                // send to imgbb server and get the url
                axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgbb}`, formData)
                    .then(res => {
                        // console.log('after img upload', res.data.data.url);
                        const photoURL = res.data.data.url

                        // create user in database
                        const userInfo = {
                            email: data.email,
                            displayName: data.name,
                            photoURL: photoURL
                        }
                        axiosSecure.post('/users', userInfo)
                            .then(res => {
                                if (res.data.insertedId) {
                                    toast.success('User registered successfully');
                                    // console.log('user created in database');
                                }
                            })

                        // update the profile to firebase
                        const userProfile = {
                            displayName: data.name,
                            photoURL: photoURL
                        }

                        updateUserProfile(userProfile)
                            .then(() => {
                                console.log('user profile updated');
                                navigate(location?.state?.from?.pathname || '/', { replace: true });
                            })
                            .catch(error => {
                                console.log(error.message);
                            })
                    })

            })
            .catch(error => {
                console.log(error.message);
            })
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            {/* Decorative Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r from-blue-500 to-purple-500 shadow-lg mb-4">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Create Your Account</h1>
                    <p className="text-gray-600 dark:text-gray-300">Join thousands of happy travelers</p>
                </div>

                {/* Registration Card */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                    <div className="h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    
                    <div className="p-8">
                        <form onSubmit={handleSubmit(handleRegister)}>
                            {/* Name Field */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <input 
                                    type="text"
                                    {...register('name', { required: true })} 
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                                    placeholder="Enter your full name"
                                />
                                {errors.name?.type === 'required' && 
                                    <p className="mt-2 text-sm text-red-500">Name is required</p>
                                }
                            </div>

                            {/* Photo Field */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Profile Photo
                                </label>
                                <input 
                                    type="file"
                                    {...register('photo', { required: true })} 
                                    className="file-input file-input-bordered w-full rounded-xl dark:bg-gray-700"
                                />
                                {errors.photo?.type === 'required' && 
                                    <p className="mt-2 text-sm text-red-500">Photo is required</p>
                                }
                            </div>

                            {/* Email Field */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <input 
                                    type="email"
                                    {...register('email', { required: true })} 
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                                    placeholder="Enter your email"
                                />
                                {errors.email?.type === 'required' && 
                                    <p className="mt-2 text-sm text-red-500">Email is required</p>
                                }
                            </div>

                            {/* Password Field */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input 
                                        name="password" 
                                        type={show ? 'text' : "password"} 
                                        defaultValue={'AZazaz1'} 
                                        {...register('password', {
                                            required: true,
                                            minLength: 6,
                                            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
                                        })} 
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 pr-12"
                                        placeholder="Create a strong password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShow(!show)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        {show ? <FaRegEye className="w-5 h-5" /> : <FaRegEyeSlash className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password?.type === 'required' && 
                                    <p className="mt-2 text-sm text-red-500">Password is required</p>
                                }
                                {errors.password?.type === 'minLength' && 
                                    <p className="mt-2 text-sm text-red-500">Password must be at least 6 characters</p>
                                }
                                {errors.password?.type === 'pattern' && 
                                    <p className="mt-2 text-sm text-red-500">Password must contain at least one Uppercase(A), Lowercase(a) and number(1)</p>
                                }
                            </div>

                            {/* Register Button */}
                            <button 
                                type="submit"
                                className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl"
                            >
                                Create Account
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center">
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">Or continue with</span>
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                        </div>

                        {/* Google Component */}
                        <div className="mb-6">
                            <Google />
                        </div>

                        {/* Login Link */}
                        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-gray-600 dark:text-gray-400">
                                Already have an account?{' '}
                                <Link 
                                    to={"/auth/login"}
                                    state={location.state}
                                    className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Security Note */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        🔒 Your information is secure and encrypted
                    </p>
                </div>
            </div>

            {/* Animation Styles */}
            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default Register;