import React, { use } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../../Context/AuthContext';
import Loading from '../../../Components/Shared/Loading';

const Profile = () => {
    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data = {}, isLoading } = useQuery({
        queryKey: ['/dashboard/profile', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`users?email=${user?.email}`);
            return res.data;
        },
        retry: 2,
        enabled: !!user?.email,
    });

    if (isLoading) return <Loading />;

    return (
        <div className='my-4'>
            <figure className='flex justify-center items-center mb-6'>
                <img referrerPolicy='no-referrer'
                    src={data.photoURL || 'https://via.placeholder.com/150'}
                    className='h-32 w-32 rounded-full object-cover border-4 border-gray-200'
                    alt="Profile"
                />
            </figure>
            <div className='mb-6'>
                <h2 className='text-center font-bold text-3xl '>{data?.displayName}</h2>
            </div>

            <div className='max-w-md mx-auto  rounded-lg shadow-md p-6'>
                <div className='space-y-6'>
                    {/* Email Section */}
                    <div className='flex items-center border-b pb-4'>
                        <div className='w-1/4'>
                            <h3 className='font-bold text-lg text-gray-300'>Email:</h3>
                        </div>
                        <div className='w-3/4'>
                            <p className='text-lg font-medium '>{data?.email}</p>
                        </div>
                    </div>

                    {/* Role Section */}
                    <div className='flex items-center'>
                        <div className='w-1/4'>
                            <h3 className='font-bold text-lg text-gray-300'>Role:</h3>
                        </div>
                        <div className='w-3/4'>
                            <p className='text-lg font-medium '>{data?.role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;