import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { FaPlane, FaBus, FaTrain, FaCar, FaShip, FaCloudUploadAlt, FaCalendarAlt, FaCheck } from 'react-icons/fa';
import axios from 'axios';

const AddTickets = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm({
        defaultValues: {
            perks: []
        }
    });


    const { user } = React.useContext(AuthContext);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [uploadingImage, setUploadingImage] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Transport types
    const transportTypes = [
        { value: 'Plane', label: 'Plane', icon: <FaPlane />, color: 'text-blue-600' },
        { value: 'Bus', label: 'Bus', icon: <FaBus />, color: 'text-green-600' },
        { value: 'Train', label: 'Train', icon: <FaTrain />, color: 'text-red-600' },
        { value: 'Car', label: 'Car', icon: <FaCar />, color: 'text-purple-600' },
        { value: 'Ship', label: 'Ship', icon: <FaShip />, color: 'text-teal-600' }
    ];

    // Perks options
    const perksOptions = [
        { id: 'ac', label: 'Air Conditioning', value: 'AC' },
        { id: 'breakfast', label: 'Breakfast', value: 'Breakfast' },
        { id: 'wifi', label: 'Wi-Fi', value: 'Wi-Fi' },
        { id: 'tv', label: 'TV', value: 'TV' },
        { id: 'meal', label: 'Meal Included', value: 'Meal' },
        { id: 'drinks', label: 'Free Drinks', value: 'Drinks' },
        { id: 'blanket', label: 'Blanket & Pillow', value: 'Blanket' },
        { id: 'charging', label: 'Charging Port', value: 'Charging' },
        { id: 'magazine', label: 'Magazines', value: 'Magazine' },
        { id: 'entertainment', label: 'Entertainment System', value: 'Entertainment' }
    ];

    // Popular destinations
    const popularDestinations = [
        "Bagerhat", "Bandarban", "Barguna", "Barisal", "Bhola",
        "Bogura", "Brahmanbaria", "Chandpur", "Chapainawabganj",
        "Chattogram", "Chuadanga", "Cox's Bazar", "Cumilla",
        "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha",
        "Gazipur", "Gopalganj", "Habiganj", "Jamalpur",
        "Jashore", "Jhalokathi", "Jhenaidah", "Joypurhat",
        "Khagrachari", "Khulna", "Kishoreganj", "Kurigram",
        "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur",
        "Magura", "Manikganj", "Meherpur", "Moulvibazar",
        "Munshiganj", "Mymensingh", "Naogaon", "Narail",
        "Narayanganj", "Narsingdi", "Natore", "Netrokona",
        "Nilphamari", "Noakhali", "Pabna", "Panchagarh",
        "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi",
        "Rangamati", "Rangpur", "Satkhira", "Shariatpur",
        "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail",
        "Thakurgaon"
    ];


    // Handle image preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle image upload to imgbb
    const uploadImageToImgbb = async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            setUploadingImage(true);
            // Use regular axios instead of axiosSecure
            const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgbb}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application.json'
                    }
                }
            );
            return response.data.data.url;
        } catch (error) {
            console.error('Image upload failed:', error);
            throw error;
        } finally {
            setUploadingImage(false);
        }
    };

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            // Upload image if exists
            let imageUrl = '';
            if (data.image && data.image[0]) {
                imageUrl = await uploadImageToImgbb(data.image[0]);
            }

            // Prepare ticket data
            const ticketData = {
                title: data.title,
                from: data.from,
                to: data.to,
                transportType: data.transportType,
                price: parseFloat(data.price),
                quantity: parseInt(data.quantity),
                departureDateTime: new Date(data.departureDateTime).toISOString(),
                perks: data.perks || [],
                image: imageUrl,
                vendorName: user?.displayName || 'Unknown Vendor',
                vendorEmail: user?.email,
                verificationStatus: 'pending',
                
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Save to database using axiosSecure 
            const response = await axiosSecure.post('/tickets', ticketData);

            if (response.data.insertedId) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Ticket added successfully and is pending verification.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didClose: () => {
                        reset();
                        setPreviewImage(null);
                        navigate('/vendor/my-tickets');
                    }
                });
            }

        } catch (error) {
            console.error('Error adding ticket:', error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to add ticket. Please try again.',
                icon: 'error',
                confirmButtonColor: '#3B82F6'
            });
        }
    };


    // Calculate total revenue
    const price = watch('price');
    const quantity = watch('quantity');
    const totalRevenue = price && quantity ? (parseFloat(price) * parseInt(quantity)).toFixed(2) : '0';

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        Add New Ticket
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Fill in the details below to list your tickets for sale
                    </p>
                </div>

                {/* Stats Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <p className="text-sm text-gray-600">Ticket Price</p>
                            <p className="text-2xl font-bold text-blue-600">
                                ৳{price || '0'}
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl">
                            <p className="text-sm text-gray-600">Total Tickets</p>
                            <p className="text-2xl font-bold text-green-600">
                                {quantity || '0'}
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl">
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-purple-600">
                                ৳{totalRevenue}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Ticket Title */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Ticket Title *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('title', {
                                            required: 'Ticket title is required',
                                            minLength: { value: 5, message: 'Title must be at least 5 characters' }
                                        })}
                                        className={`w-full bg-white text-black px-4 py-3 rounded-xl border ${errors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} focus:ring-2 focus:ring-blue-200 transition duration-200`}
                                        placeholder="e.g., Express Bus: Dhaka to Cox's Bazar"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600">{errors.title.message}</p>
                                    )}
                                </div>

                                {/* Route Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 bg-white text-black">
                                        <label className="block text-sm font-medium text-gray-700">
                                            From (Location) *
                                        </label>
                                        <div className="relative">
                                            <select
                                                {...register('from', { required: 'Departure location is required' })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none bg-white transition duration-200"
                                            >
                                                <option className='' value="">Select departure point</option>
                                                {popularDestinations.map((dest, index) => (
                                                    <option key={index} value={dest}>{dest}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none ">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        {errors.from && (
                                            <p className="text-sm text-red-600">{errors.from.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2 bg-white text-black">
                                        <label className="block text-sm font-medium text-gray-700">
                                            To (Destination) *
                                        </label>
                                        <div className="relative">
                                            <select
                                                {...register('to', { required: 'Destination is required' })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none bg-white transition duration-200"
                                            >
                                                <option value="">Select destination</option>
                                                {popularDestinations.map((dest, index) => (
                                                    <option key={index} value={dest}>{dest}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        {errors.to && (
                                            <p className="text-sm text-red-600">{errors.to.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Transport Type */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Transport Type *
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {transportTypes.map((type) => (
                                            <label
                                                key={type.value}
                                                className={`relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${watch('transportType') === type.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                                            >
                                                <input
                                                    type="radio"
                                                    value={type.value}
                                                    {...register('transportType', { required: 'Transport type is required' })}
                                                    className="absolute opacity-0"
                                                />
                                                <div className={`text-2xl ${type.color} mb-2`}>
                                                    {type.icon}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{type.label}</span>
                                                {watch('transportType') === type.value && (
                                                    <div className="absolute top-2 right-2">
                                                        <FaCheck className="text-blue-500" />
                                                    </div>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.transportType && (
                                        <p className="text-sm text-red-600">{errors.transportType.message}</p>
                                    )}
                                </div>

                                {/* Price and Quantity */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Price (per ticket) *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500">৳</span>
                                            </div>
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register('price', {
                                                    required: 'Price is required',
                                                    min: { value: 1, message: 'Price must be at least ৳1' }
                                                })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.price && (
                                            <p className="text-sm text-red-600">{errors.price.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Ticket Quantity *
                                        </label>
                                        <input
                                            type="number"
                                            {...register('quantity', {
                                                required: 'Quantity is required',
                                                min: { value: 1, message: 'At least 1 ticket required' },
                                                max: { value: 1000, message: 'Maximum 1000 tickets' }
                                            })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                            placeholder="Number of tickets"
                                        />
                                        {errors.quantity && (
                                            <p className="text-sm text-red-600">{errors.quantity.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Departure Date & Time */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Departure Date & Time *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaCalendarAlt className="text-gray-400" />
                                        </div>
                                        <input
                                            type="datetime-local"
                                            {...register('departureDateTime', {
                                                required: 'Departure date and time is required',
                                                validate: (value) => {
                                                    const selectedDate = new Date(value);
                                                    const now = new Date();
                                                    return selectedDate > now || 'Departure time must be in the future';
                                                }
                                            })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                            min={new Date().toISOString().slice(0, 16)}
                                        />
                                    </div>
                                    {errors.departureDateTime && (
                                        <p className="text-sm text-red-600">{errors.departureDateTime.message}</p>
                                    )}
                                </div>

                                {/* Perks */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Available Perks (Select all that apply)
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {perksOptions.map((perk) => (
                                            <label
                                                key={perk.id}
                                                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 ${watch('perks')?.includes(perk.value) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={perk.value}
                                                    {...register('perks')}
                                                    className="mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{perk.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Ticket/Vehicle Image
                                    </label>
                                    <div className="space-y-4">
                                        <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition duration-200 ${previewImage ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                {...register('image')}
                                                onChange={handleImageChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="space-y-3">
                                                <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                                                </div>
                                            </div>
                                        </div>
                                        {previewImage && (
                                            <div className="relative">
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="w-full h-64 object-cover rounded-xl shadow-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPreviewImage(null);
                                                        reset({ ...watch(), image: null });
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-200"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Vendor Info (Readonly) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Vendor Name
                                        </label>
                                        <input
                                            type="text"
                                            value={user?.displayName || 'Unknown Vendor'}
                                            readOnly
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-600"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Vendor Email
                                        </label>
                                        <input
                                            type="email"
                                            value={user?.email || 'No email provided'}
                                            readOnly
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-600"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={uploadingImage}
                                        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition duration-200 flex items-center justify-center space-x-3 ${uploadingImage ? 'bg-blue-400 cursor-not-allowed' : 'bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl'}`}
                                    >
                                        {uploadingImage ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Uploading Image...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaCheck className="text-xl" />
                                                <span>Add Ticket to Marketplace</span>
                                            </>
                                        )}
                                    </button>
                                    <p className="text-sm text-gray-500 text-center mt-3">
                                        Ticket will be listed after admin verification
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 sticky top-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <FaCheck className="mr-2 text-green-500" />
                                Ticket Preview
                            </h3>

                            <div className="space-y-6">
                                {/* Preview Card */}
                                <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-800">
                                                {watch('title') || 'Ticket Title'}
                                            </h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {watch('from') || 'Departure'} → {watch('to') || 'Destination'}
                                            </p>
                                        </div>
                                        {watch('transportType') && (
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                {watch('transportType')}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center text-gray-600">
                                            <FaCalendarAlt className="mr-2" />
                                            <span className="text-sm">
                                                {watch('departureDateTime') ?
                                                    new Date(watch('departureDateTime')).toLocaleString() :
                                                    'Not set'
                                                }
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                            <div>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    ৳{price || '0'}
                                                </p>
                                                <p className="text-sm text-gray-500">per ticket</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-700">
                                                    {quantity || '0'} tickets
                                                </p>
                                                <p className="text-sm text-gray-500">available</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Perks Preview */}
                                {watch('perks')?.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-3">Included Perks:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {watch('perks').map((perk, index) => (
                                                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                                    {perk}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quick Stats */}
                                <div className="bg-gray-50 rounded-xl p-5">
                                    <h4 className="font-semibold text-gray-700 mb-4">Quick Stats</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Price per ticket:</span>
                                            <span className="font-semibold">৳{price || '0'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total tickets:</span>
                                            <span className="font-semibold">{quantity || '0'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total revenue:</span>
                                            <span className="font-bold text-purple-600">৳{totalRevenue}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tips */}
                                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        Tips for Success
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-start">
                                            <span className="text-green-500 mr-2">✓</span>
                                            Set competitive pricing
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-green-500 mr-2">✓</span>
                                            Add clear, attractive images
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-green-500 mr-2">✓</span>
                                            List all available perks
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-green-500 mr-2">✓</span>
                                            Provide accurate departure times
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTickets;