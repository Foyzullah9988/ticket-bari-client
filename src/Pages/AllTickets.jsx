import React from 'react';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import TicketCard from './Home/TicketCard';
import Loading from '../Components/Shared/Loading';




const AllTickets = () => {

    const axiosSecure = useAxiosSecure()

    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        },
        retry: 2,
    });


    const { data: tickets = [], isLoading } = useQuery({
        queryKey: ['tickets'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tickets')
            return res.data
        }
    })

   

   

    if (isLoading || usersLoading) return <Loading />

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
        <div className="flex flex-col h-full  mb-8">
            <h2>all tickets {realTickets.length}</h2>
            <div className="">
                <TicketCard realTickets={realTickets} />
            </div>

        </div>
    );
};

export default AllTickets;