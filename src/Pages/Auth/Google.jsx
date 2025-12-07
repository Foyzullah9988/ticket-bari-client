import React, { use } from 'react';
import { useLocation, useNavigate } from 'react-router';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import { AuthContext } from '../../Context/AuthContext';
// import useAxiosSecure from '../../Hooks/useAxiosSecure';

const Google = () => {
    // const axiosSecure = useAxiosSecure();
    const axiosPublic = useAxiosPublic();
    const { signinGoogle } = use(AuthContext)

    const location = useLocation();

    const navigate = useNavigate();

    const handleGoogleSignin = () => {
        signinGoogle()
            .then(result => {
                const user = result.user;
                // console.log(user);
                navigate(location?.state?.from?.pathname || '/', { replace: true });

                console.log(result);
                // create user in database
                const userInfo = {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                }
                axiosPublic.post('/users', userInfo)
                    .then(res => {
                        if (res.data.insertedId) {
                            console.log('user created in database google');
                            navigate(location?.state?.from?.pathname || '/', { replace: true });
                        }
                    })
            })
            .catch(error => {
                console.error(error);
            })
    }

    return (
        <div className=' flex justify-center flex-col'>
            <div className='flex justify-center items-center gap-1 my-2'>
                <div className='w-full'>
                    <hr />
                </div>

                <p className='text-center '>OR</p>
                 <div className='w-full'>
                    <hr />
                </div>
            </div>
            <button onClick={handleGoogleSignin} className="btn bg-white text-black border-[#e5e5e5]">
                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                Login with Google
            </button>
        </div>
    );
};

export default Google;