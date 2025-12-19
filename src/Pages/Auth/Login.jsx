import { useForm } from 'react-hook-form';
import { use, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import Google from './Google';
import { AuthContext } from '../../Context/AuthContext';
import toast from 'react-hot-toast';
import { 
    FaRegEye, 
    FaRegEyeSlash, 
    FaEnvelope, 
    FaLock, 
    FaArrowRight,
    FaTicketAlt,
    FaCheckCircle,
    FaUser,
    FaShieldAlt,
    FaRocket
} from 'react-icons/fa';

const Login = () => {
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signinUser } = use(AuthContext);

    const location = useLocation();
    const navigate = useNavigate();

    const handleLogin = (data) => {
        setIsLoading(true);
        signinUser(data.email, data.password)
            .then(result => {
                const user = result.user;
                console.log(user);
                toast.success('Welcome back! Login successful! 🎉', {
                    duration: 3000,
                    style: {
                        background: '#10B981',
                        color: '#fff',
                    },
                });
                setIsLoading(false);
                navigate(location?.state?.from?.pathname || '/', { replace: true });
            })
            .catch(error => {
                setIsLoading(false);
                toast.error('Invalid email or password. Please try again.', {
                    duration: 3000,
                    style: {
                        background: '#EF4444',
                        color: '#fff',
                    },
                });
                console.log(error.message);
            })
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Header Card */}
                <div className="text-center mb-8">
                    
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        Welcome Back !
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Sign in to access your travel dashboard
                    </p>
                </div>

                {/* Main Login Card */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                    {/* Decorative Top Bar */}
                    <div className="h-2 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                    <div className="p-8">
                        

                        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <FaEnvelope className="text-blue-500" />
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-xl blur-md opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
                                    <input
                                        type="email"
                                        {...register('email', { required: true })}
                                        className="relative w-full p-4 pl-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:ring-opacity-50 transition-all duration-300"
                                        placeholder="Enter your email"
                                    />
                                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                {errors.email?.type === 'required' && (
                                    <p className="text-sm text-red-500 flex items-center gap-2">
                                        <span>•</span> Email is required
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <FaLock className="text-purple-500" />
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl blur-md opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
                                    <input
                                        name="password"
                                        type={show ? 'text' : "password"}
                                        defaultValue={'AZazaz1'}
                                        {...register('password', {
                                            required: true,
                                            minLength: 6,
                                        })}
                                        className="relative w-full p-4 pl-12 pr-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 focus:ring-opacity-50 transition-all duration-300"
                                        placeholder="Enter your password"
                                    />
                                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <button
                                        type="button"
                                        onClick={() => setShow(!show)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    >
                                        {show ? <FaRegEye className="text-xl" /> : <FaRegEyeSlash className="text-xl" />}
                                    </button>
                                </div>
                                {errors.password?.type === 'required' && (
                                    <p className="text-sm text-red-500 flex items-center gap-2">
                                        <span>•</span> Password is required
                                    </p>
                                )}
                                {errors.password?.type === 'minLength' && (
                                    <p className="text-sm text-red-500 flex items-center gap-2">
                                        <span>•</span> Password must be at least 6 characters
                                    </p>
                                )}
                            </div>

                            {/* Forgot Password */}
                            <div className="flex justify-end">
                                <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium">
                                    Forgot password?
                                </a>
                            </div>
                        

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-3">
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Signing in...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                                        </>
                                    )}
                                </div>
                                <div className="absolute inset-0 rounded-xl border-2 border-white/30 animate-ping-slow opacity-0 group-hover:opacity-100"></div>
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-8 flex items-center">
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">Or continue with</span>
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                        </div>

                        {/* Google Login */}
                        <div className="mb-6">
                            <Google />
                        </div>

                        {/* Register Link */}
                        <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-gray-600 dark:text-gray-400">
                                New to Ticket Bari?{' '}
                                <Link
                                    to={'/auth/register'}
                                    state={location.state}
                                    className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                                >
                                    Create an account
                                    <FaRocket className="text-sm animate-bounce" />
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Security Note */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                        <FaShieldAlt className="text-green-500" />
                        Your login information is securely encrypted
                    </p>
                </div>
            </div>

            {/* Add animation styles */}
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
                .animate-ping-slow {
                    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                @keyframes ping {
                    75%, 100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;