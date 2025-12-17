import React, { useState, useContext } from 'react';
import {
    FaUser,
    FaUserShield,
    FaStore,
    FaBan,
    FaTrash,
    FaCheck,
    FaExclamationTriangle,
    FaSearch,
    FaFilter,
    FaSync,
    FaExclamationCircle,
    FaTimes
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../../Context/AuthContext';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from '../../../Components/Shared/Loading';

const ManageUsers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const { user: currentUser } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    // Fetch users with proper error handling
    const { 
        data: users = [], 
        isLoading, 
        error, 
        refetch 
    } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to load users');
        }
    });



    
    // Open modal with different actions
    const openModal = (type, user, newRole = null) => {
        let modalData = {
            type,
            user,
            newRole
        };

       

        setModalData(modalData);
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setModalData(null);
    };


    // Filter and search users
    const filteredUsers = users.filter(user => {
        const matchesSearch = searchTerm === '' || 
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role) => {
        const badges = {
            admin: {
                color: 'bg-purple-100 text-purple-800',
                icon: <FaUserShield className="mr-1" />,
                text: 'Admin'
            },
            vendor: {
                color: 'bg-blue-100 text-blue-800',
                icon: <FaStore className="mr-1" />,
                text: 'Vendor'
            },
            user: {
                color: 'bg-green-100 text-green-800',
                icon: <FaUser className="mr-1" />,
                text: 'User'
            }
        };

        const badge = badges[role] || badges.user;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${badge.color}`}>
                {badge.icon}
                {badge.text}
            </span>
        );
    };

    const getStatusBadge = (user) => {
        if (user.isFraud) {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 flex items-center">
                    <FaExclamationTriangle className="mr-1" />
                    Fraud
                </span>
            );
        }

      
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="p-6">
                <Loading />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex items-center">
                        <FaExclamationCircle className="text-red-500 mr-2" />
                        <h3 className="text-lg font-semibold text-red-800">Error Loading Users</h3>
                    </div>
                    <p className="text-red-700 mt-2">
                        {error.response?.data?.error || 'Unable to load users. Please try again.'}
                    </p>
                    <button
                        onClick={refetch}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        <FaSync className="mr-2" />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            

            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Manage Users</h1>
                        <p className="text-gray-600">Manage user roles, mark vendors as fraud, and delete users</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <button
                            onClick={refetch}
                            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            <FaSync className="mr-2" />
                            Refresh
                        </button>
                        <span className="text-sm text-gray-500">
                            {filteredUsers.length} of {users.length} users
                        </span>
                    </div>
                    
                </div>
                {/* Statistics Cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
                    <div className="text-xl md:text-3xl font-bold mb-2">{users.length}</div>
                    <div className="text-sm opacity-90">Total Users</div>
                </div>

                <div className="bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
                    <div className="text-xl md:text-3xl font-bold mb-2">
                        {users.filter(u => u.role === 'user').length}
                    </div>
                    <div className="text-sm opacity-90">Regular Users</div>
                </div>

                <div className="bg-linear-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
                    <div className="text-xl md:text-3xl font-bold mb-2">
                        {users.filter(u => u.role === 'vendor').length}
                    </div>
                    <div className="text-sm opacity-90">Vendors</div>
                </div>

                <div className="bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
                    <div className="text-xl md:text-3xl font-bold mb-2">
                        {users.filter(u => u.isFraud).length}
                    </div>
                    <div className="text-sm opacity-90">Fraud Vendors</div>
                </div>
            </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
                        <div className="relative">
                            <FaFilter className="absolute left-3 top-3 text-gray-400" />
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white"
                            >
                                <option value="all">All Roles</option>
                                <option value="user">Users</option>
                                <option value="vendor">Vendors</option>
                                <option value="admin">Admins</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-sm text-gray-500">
                        Total: <span className="font-semibold">{users.length}</span>
                    </span>
                    <span className="text-sm text-gray-500">
                        Users: <span className="font-semibold">{users.filter(u => u.role === 'user').length}</span>
                    </span>
                    <span className="text-sm text-gray-500">
                        Vendors: <span className="font-semibold">{users.filter(u => u.role === 'vendor').length}</span>
                    </span>
                    <span className="text-sm text-gray-500">
                        Admins: <span className="font-semibold">{users.filter(u => u.role === 'admin').length}</span>
                    </span>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                        <FaSearch className="text-4xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No users found</h3>
                        <p className="text-gray-500">
                            {searchTerm || filterRole !== 'all' 
                                ? 'Try adjusting your search or filter' 
                                : 'No users in the system yet'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role & Status
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="shrink-0 h-10 w-10 md:h-12 md:w-12">
                                                    <img
                                                        className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-gray-200"
                                                        src={user.photoURL || '/default-avatar.png'}
                                                        alt={user.name}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/default-avatar.png';
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-[150px] md:max-w-none">
                                                        {user.name}
                                                        {currentUser?._id === user._id && (
                                                            <span className="ml-2 text-xs text-blue-600">(You)</span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500 truncate max-w-[150px] md:max-w-none">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 md:px-6 py-4">
                                            <div className="space-y-2">
                                                <div>{getRoleBadge(user.role)}</div>
                                                <div>{getStatusBadge(user)}</div>
                                            </div>
                                        </td>

                                        <td className="px-4 md:px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(user.createdAt).toLocaleTimeString()}
                                            </div>
                                        </td>

                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                {/* Make Admin */}
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => openModal('role', user, 'admin')}
                                                        disabled={currentUser?._id === user._id}
                                                        title={currentUser?._id === user._id ? "Cannot change your own role" : "Make Admin"}
                                                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition ${currentUser?._id === user._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <FaUserShield className="mr-1" />
                                                        Admin
                                                    </button>
                                                )}

                                                {/* Make Vendor */}
                                                {user.role !== 'vendor' && (
                                                    <button
                                                        onClick={() => openModal('role', user, 'vendor')}
                                                        disabled={currentUser?._id === user._id}
                                                        title={currentUser?._id === user._id ? "Cannot change your own role" : "Make Vendor"}
                                                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${currentUser?._id === user._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <FaStore className="mr-1" />
                                                        Vendor
                                                    </button>
                                                )}

                                                {/* Make User */}
                                                {user.role !== 'user' && (
                                                    <button
                                                        onClick={() => openModal('role', user, 'user')}
                                                        disabled={currentUser?._id === user._id}
                                                        title={currentUser?._id === user._id ? "Cannot change your own role" : "Make User"}
                                                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ${currentUser?._id === user._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <FaUser className="mr-1" />
                                                        User
                                                    </button>
                                                )}

                                                {/* Mark as Fraud */}
                                                {user.role === 'vendor' && !user.isFraud && (
                                                    <button
                                                        onClick={() => openModal('fraud', user)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                                                    >
                                                        <FaExclamationTriangle className="mr-1" />
                                                        Fraud
                                                    </button>
                                                )}

                                                {/* Delete User */}
                                                <button
                                                    onClick={() => openModal('delete', user)}
                                                    disabled={currentUser?._id === user._id}
                                                    title={currentUser?._id === user._id ? "Cannot delete yourself" : "Delete User"}
                                                    className={`inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ${currentUser?._id === user._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <FaTrash className="mr-1" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            
            {/* Modal Component - Defined Inside ManageUsers */}
            {showModal && modalData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div 
                        className="fixed inset-0 bg-black/80 bg-opacity-50" 
                        onClick={!isLoading ? closeModal : undefined}
                    ></div>
                    
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {modalData.title}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    disabled={isLoading}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <p className="text-gray-600 mb-6">
                                {modalData.message}
                            </p>
                            
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={closeModal}
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={modalData.onConfirm}
                                    disabled={isLoading}
                                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${modalData.confirmColor} disabled:opacity-50 transition`}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        modalData.confirmText
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;