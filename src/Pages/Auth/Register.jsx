import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import Google from './Google';
import axios from 'axios';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { AuthContext } from '../../Context/AuthContext';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { registerUser, updateUserProfile } = use(AuthContext);
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
                        console.log('after img upload', res.data.data.url);
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
                                    console.log('user created in database');
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
        <div className='w-96 mx-auto mb-2'>
            <div className='text-center'>
                <h2 className='text-3xl'>Welcome </h2>
                <p>Register Here</p>
            </div>
            <form onSubmit={handleSubmit(handleRegister)}>
                <fieldset className="fieldset">

                    {/* name */}
                    <label className="label">Name</label>
                    <input type="name"
                        {...register('name', { required: true })} className="input w-full" placeholder="Name" />
                    {
                        errors.name?.type === 'required' && <p className="text-red-500">Name is required</p>
                    }

                    {/* photo */}
                    <label className="label">Photo</label>

                    <input type="file"
                        {...register('photo', { required: true })} className="file-input w-full" />
                    {
                        errors.photo?.type === 'required' && <p className="text-red-500">Photo is required</p>
                    }

                    {/* email */}
                    <label className="label">Email</label>
                    <input type="email"
                        {...register('email', { required: true })} className="input  w-full" placeholder="Email" />
                    {
                        errors.email?.type === 'required' && <p className="text-red-500">Email is required</p>
                    }

                    {/* password */}
                    <label className="label">Password</label>
                    <input type="password" defaultValue={'AZazaz1'} {...register('password', {
                        required: true,
                        minLength: 6,
                        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
                    })} className="input w-full" placeholder="Password" />
                    {
                        errors.password?.type === 'required' && <p className="text-red-500">Password is required</p>
                    }
                    {
                        errors.password?.type === 'minLength' && <p className="text-red-500">Password must be at least 6 characters</p>
                    }
                    {
                        errors.password?.type === 'pattern' && <p className="text-red-500">Password must contain at least one Uppercase(A),Lowercase(a) and number(1) </p>
                    }

                    <button className="btn btn-neutral mt-4">Register</button>
                </fieldset>
                <p className='text-center my-2'>Already have an account? <Link to={"/auth/login"}
                    state={location.state}
                    className='text-blue-500'>Login</Link></p>
            </form>
            <div >
                <Google />
            </div>
        </div>

    );
};

export default Register;