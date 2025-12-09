import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

export default function TicketCard() {
    const axiosPublic = useAxiosPublic()
    const { data: tickets = [] } = useQuery({
        queryKey: ['tickets'],
        queryFn: async () => {
            const res = await axiosPublic.get('/tickets')
            return res.data
        }
    })
    const sortedTickets = tickets.sort((a,b) =>new Date(b.data)-new Date(a.data)).slice(0,8)
    console.log(tickets);
    return (
        <div className="flex flex-col h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-5">
                {
                    sortedTickets.map((ticket, i) => <div  key={i}  className="w-full bg-black/80 text-white rounded-3xl p-6 shadow-2xl border border-gray-800 flex flex-col h-full">
                        {/* Header */}
                        <div>
                            <figure>
                                <img src={ticket.image} className="h-32 border w-full rounded-2xl" alt="" />
                            </figure>
                        </div>
                        <div className="flex flex-col items-center mb-6">
                            <p className="text-lg font-semibold mt-3">{ticket.title}</p>
                            <p className="text-gray-400 text-sm">Jakarta - Bandung High Speed Railway</p>
                        </div>

                        {/* Time Section */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-3xl font-bold">07:15</p>
                                <p className="text-gray-400 text-sm">JKT (Jakarta)</p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-300">🚄</p>
                                <p className="text-gray-500 text-sm">30 Minutes</p>
                            </div>
                            <div>
                                {ticket.price} tk
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-3 gap-3 text-center text-sm py-4 border-y border-gray-700 mb-4">
                            <div>
                                <p className="text-gray-400">Date</p>
                                <p className="font-semibold">{ticket.date}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">{ticket.transportType}</p>
                                <p className="font-semibold">Sangkuriang</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Seat</p>
                                <p className="font-semibold">{ticket.ticketQuantity}</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex justify-between rounded-2xl p-1 mb-4 text-sm">
                            <button className="w-1/3 py-2 rounded-xl font-medium">Food & Drink</button>
                        </div>

                        {/* Perks Section - This will take available space */}
                        <div className="flex-1">
                            <h2>Perks:</h2>
                            <ul>
                                {ticket.perks.map((perk, index) => (
                                    <li key={index}>{perk}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Button - This will always stay at bottom */}
                        <div className="mt-auto pt-4">
                            <button className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                                See details
                            </button>
                        </div>
                    </div>)
                }
            </div>

        </div>
    );
}