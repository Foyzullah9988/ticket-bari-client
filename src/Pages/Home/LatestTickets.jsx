import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import TicketCard from './TicketCard';
import Loading from '../../Components/Shared/Loading';
import Skeleton1 from '../../Components/Shared/Skeleton1';

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
        .filter(user => user.role === 'fraud')
        .map(user => user.email);

    console.log(fraudEmails);


    const realTickets = tickets
        .filter(ticket =>
            ticket.verificationStatus === 'approved' &&
            !fraudEmails.includes(ticket?.vendorEmail)
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);

    console.log(realTickets);

    return (
        <div>
            <h2>Latest Tickets: {realTickets.length}</h2>
            <TicketCard realTickets={realTickets} isLoading={ticketsLoading} />
        </div>
    );
};

export default LatestTickets;