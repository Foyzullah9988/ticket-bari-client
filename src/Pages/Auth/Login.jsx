import { useForm } from 'react-hook-form';
import { use, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import Google from './Google';
import { AuthContext } from '../../Context/AuthContext';
import toast from 'react-hot-toast';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';


const Login = () => {
    const [show, setShow] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signinUser } = use(AuthContext);

    const location = useLocation();
    const navigate = useNavigate();

    const handleLogin = (data) => {
        signinUser(data.email, data.password)
            .then(result => {
                const user = result.user;
                console.log(user);
                navigate(location?.state?.from?.pathname || '/', { replace: true });
            })
            .catch(error => {
                toast.error('Invalid email or password')
                console.log(error.message);
            })
    }

    return (
        <div className='w-96 mx-auto mb-2'>
            <div className='text-center'>
                <h2 className='text-3xl'>Welcome Back</h2>
                <p>Please login</p>
            </div>
            <form onSubmit={handleSubmit(handleLogin)}>
                <fieldset className="fieldset">
                    <label className="label">Email</label>
                    <input type="email" {...register('email', {
                        required: true,

                    })} className="input  w-full" placeholder="Email" />
                    {
                        errors.email?.type === 'required' && <p className="text-red-500">Email is required</p>
                    }

                    <div className='relative'>
                        <label className="label">Password</label>
                        <input  name='password' type={show ? 'text' : "password"} defaultValue={'AZazaz1'} {...register('password', {
                            required: true,
                            minLength: 6,
                        })} className="input  w-full" placeholder="Password" />
                        <span onClick={() => setShow(!show)} className='absolute top-7 right-2 text-xl cursor-pointer'>
                            {
                                show ? <FaRegEye color='black' /> : <FaRegEyeSlash color='black' />
                            }

                            {/*  */}
                        </span>
                    </div>
                    {
                        errors.password?.type === 'required' && <p className="text-red-500">Password is required</p>
                    }
                    {
                        errors.password?.type === 'minLength' && <p className="text-red-500">Password must be at least 6 characters</p>
                    }
                    <div><a className="link link-hover">Forgot password?</a></div>

                    <button className="btn btn-neutral mt-4">Login</button>
                </fieldset>
                <p className='text-center'>New to Zap Shift? <Link to={'/auth/register'}
                    state={location.state}
                    className='text-blue-500'>Register</Link></p>
            </form>
            <Google />
        </div>
    );
};

export default Login;