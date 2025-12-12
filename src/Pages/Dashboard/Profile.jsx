import React, { useContext } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../Context/AuthContext';
import Loading from '../../Components/Shared/Loading';
import {
    UserIcon,
    EnvelopeIcon,
    ShieldCheckIcon,
    UserCircleIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data: userData = {}, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['dashboard-profile', user?.email],
        queryFn: async () => {
            if (!user?.email) return null;
            const res = await axiosSecure.get(`users?email=${user.email}`);
            return res.data || {};
        },
        retry: 2,
        retryDelay: 1000,
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!user?.email,
    });

    // Handle loading state
    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    // Handle error state
    if (isError) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
                    <ShieldCheckIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-700 mb-2">An error occurred</h3>
                    <p className="text-red-600 mb-4">{error?.message}</p>
                    <button
                        onClick={() => refetch()}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    console.log(userData);

    // Handle no data state
    if (!userData || Object.keys(userData).length === 0) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
                <UserCircleIcon className="h-20 w-20 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Profile Not Found</h3>
                <p className="text-gray-500">Your data hadn't found.</p>
            </div>
        );
    }

    const { displayName, email, role, photoURL, createdAt, lastLogin } = userData;

    // Format date
    const formatDate = (createdAt) => {
        if (!createdAt) return 'N/A';
        const date = new Date(createdAt);
        return date.toLocaleDateString({
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">My Profile</h1>

                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Profile Header */}
                    <div className="relative bg-linear-to-r from-blue-500 to-purple-600 py-8 px-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Profile Image */}
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full border-4 border-white/30 shadow-lg overflow-hidden">
                                    <img
                                        referrerPolicy="no-referrer"
                                        src={photoURL || 'https://via.placeholder.com/150'}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/150';
                                        }}
                                    />
                                </div>
                                <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md">
                                    <PencilSquareIcon className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    {displayName}
                                </h2>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-white/90">
                                    <UserIcon className="h-5 w-5" />
                                    <span className="text-lg">{role}</span>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                                        Become a member : {formatDate(createdAt)}
                                    </span>
                                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                                        Last Login: {formatDate(lastLogin)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Email Section */}
                            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wider">
                                            Email
                                        </h3>
                                        <p className="text-lg font-medium text-gray-800 break-all">
                                            {email || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                    This email is used for login and notifications.
                                </p>
                            </div>

                            {/* Role Section */}
                            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-purple-100 p-3 rounded-lg">
                                        <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wider">
                                            Role
                                        </h3>
                                        <p className="text-lg font-medium text-gray-800">
                                            {role}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Determines your account authorization and privileges
                                </p>
                            </div>
                        </div>

                        {/* Additional Info (if available) */}
                        {/* {(userData.bio || userData.phone || userData.address) && (
                            <div className="mt-8 h-96">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {userData.bio && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-medium text-gray-600 mb-1">Bio</h4>
                                            <p className="text-gray-800">{userData.bio}</p>
                                        </div>
                                    )}
                                    {userData.phone && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-medium text-gray-600 mb-1">ফোন নম্বর</h4>
                                            <p className="text-gray-800">{userData.phone}</p>
                                        </div>
                                    )}
                                    {userData.address && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-medium text-gray-600 mb-1">ঠিকানা</h4>
                                            <p className="text-gray-800">{userData.address}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )} */}

                        {/* Action Buttons */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-4">
                            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <PencilSquareIcon className="h-5 w-5" />
                                Update profile
                            </button>
                            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                                Change Password
                            </button>
                            <button
                                onClick={() => refetch()}
                                className="text-gray-600 hover:text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Status</p>
                                <p className="text-lg font-semibold text-green-600">Active</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <div className="h-4 w-4 rounded-full bg-green-500"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Verification</p>
                                <p className="text-lg font-semibold text-blue-600">
                                    {email ? 'Verified' : 'Pending'}
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Become a member</p>
                                <p className="text-lg font-semibold text-purple-600">
                                    {formatDate(createdAt)}
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;