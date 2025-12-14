import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import TicketCard from './TicketCard';
import Loading from '../../Components/Shared/Loading';
import Skeleton1 from '../../Components/Shared/Skeleton1';

const LatestTickets = () => {
    const axiosSecure = useAxiosSecure();
    
    const { data: tickets = [], isLoading, error } = useQuery({
        queryKey: ['latest-tickets'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tickets');
            return res.data;
        },
        retry: 2,
    });

   
    
    
    if (error) {
        console.error('Error fetching tickets:', error);
        return <div>Error loading tickets</div>;
    }

 
    const appTickets = tickets.filter(ticket => ticket.verificationStatus === 'approved');

    const lastedTickets = 
    appTickets
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

    console.log(tickets);
    return (
        <div>
            <h2>tickets{lastedTickets.length}</h2>
            <TicketCard lastedTickets={lastedTickets} isLoading={isLoading}/>
        </div>
    );
};

export default LatestTickets;