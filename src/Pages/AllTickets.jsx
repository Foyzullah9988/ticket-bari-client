import React from 'react';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import TicketCard from './Home/TicketCard';
import Loading from '../Components/Shared/Loading';




const AllTickets = () => {

    const axiosSecure = useAxiosSecure()
    const { data: tickets = [] ,isLoading} = useQuery({
        queryKey: ['tickets'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tickets')
            return res.data
        }
    })

    const lastedTickets = 
    tickets
    .sort((a,b) =>new Date(b.data)-new Date(a.data))

    if(isLoading)return <Loading />

    return (
        <div className="flex flex-col h-full border mb-8">
            <h2>all tickets {lastedTickets.length}</h2>
            <div className="">
                <TicketCard lastedTickets={lastedTickets}/>
            </div>

        </div>
    );
};

export default AllTickets;