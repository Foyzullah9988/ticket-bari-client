import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import TicketCard from './TicketCard';
import Loading from '../../Components/Shared/Loading';

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

    if (isLoading) return <Loading />;
    
    
    if (error) {
        console.error('Error fetching tickets:', error);
        return <div>Error loading tickets</div>;
    }

 
    

    const lastedTickets = 
    tickets
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 8);

    return (
        <div>
            <h2>tickets{lastedTickets.length}</h2>
            <TicketCard lastedTickets={lastedTickets} />
        </div>
    );
};

export default LatestTickets;