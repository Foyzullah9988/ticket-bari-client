import axios from 'axios';
import React from 'react';

const useAxiosPublic = () => {
    const axiosPublic = axios.create({
        baseURL: 'https://ticket-bari-server-red.vercel.app'
    });
    return axiosPublic;
};

export default useAxiosPublic;
