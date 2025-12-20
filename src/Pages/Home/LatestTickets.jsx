import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import TicketCard from './TicketCard';
import Loading from '../../Components/Shared/Loading';
import Skeleton1 from '../../Components/Shared/Skeleton1';
import { Link } from 'react-router';
import { FaArrowRight } from 'react-icons/fa';

const LatestTickets = () => {
    const axiosSecure = useAxiosSecure();


    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        },
        retry: 2,
    });

    const { data: tickets = [], isLoading: ticketsLoading, error } = useQuery({
        queryKey: ['latest-tickets', users.length],
        queryFn: async () => {
            const res = await axiosSecure.get('/tickets');
            return res.data;
        },
        enabled: !usersLoading,
        retry: 2,
    });
    

    if (error) {
        console.error(error);
        return <div>Error loading tickets</div>;
    }

    if (usersLoading || ticketsLoading) {
        return <div className='flex justify-evenly items-center'>
            <Skeleton1 /> <Skeleton1 /> 
        </div>;
    }


    const fraudEmails = users
        .filter(user => user.role === 'fraud' || user.role !== 'vendor')
        .map(user => user.email);

    // console.log(fraudEmails);


    const realTickets = tickets
        .filter(ticket =>
            ticket.verificationStatus === 'approved' &&
            !fraudEmails.includes(ticket?.vendorEmail)
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);

    // console.log(realTickets);

    return (
        <div>
            
            <TicketCard realTickets={realTickets} isLoading={ticketsLoading} />
            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-center items-center">
                                        <Link
                                            to={`/all-tickets`}
                                            className="group/btn inline-flex items-center justify-center gap-2 px-9 py-4 bg-  bg-linear-to-l from-green-500 to-green-900 dark:to-black/90 dark:from-black/20 
                                                                        hover:from-10% hover:to-40%
                                                                         text-white  rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                                        >
                                            <span>Explore All Tickets</span>
                                            <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
        </div>
    );
};

export default LatestTickets;