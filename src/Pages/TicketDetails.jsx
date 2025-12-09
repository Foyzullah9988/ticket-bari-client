import React from "react";
import Navbar from "../Components/Shared/Navbar";
import Footer from "../Components/Shared/Footer";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useParams} from "react-router";
import Loading from "../Components/Shared/Loading";

export default function TicketDetails() {
    const axiosSecure = useAxiosSecure();
    const { id } = useParams();
    
    const { data: ticket, isLoading, error } = useQuery({
        queryKey: ['ticket', id], 
        queryFn: async () => {
            const res = await axiosSecure.get(`/tickets/${id}`);
            return res.data;
        },
        enabled: !!id, 
        retry: 2,
    });

    if (isLoading) return <Loading />;
    
    if (error) {
        console('Error fetching ticket:', error);
        
    }

    // Check if ticket data exists
    if (!ticket) {
        return <Loading/>
    }
    console.log(ticket);
    
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar fixed={false} />
            <div className="flex-1 bg-black flex items-center justify-center p-6">
                <div className="w-full bg-[#0f0f0f] text-white rounded-3xl p-6 shadow-2xl border border-gray-800">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-6">
                        <figure>
                            <img 
                                src={ticket.image || '/default-ticket.jpg'} 
                                className="h-48 w-full object-cover rounded-lg"
                                alt={ticket.title} 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/default-ticket.jpg';
                                }}
                            />
                        </figure>
                        <p className="text-lg font-semibold mt-3">{ticket.title}</p>
                        {ticket.subTitle && <p className="text-gray-400 text-sm">{ticket.subTitle}</p>}
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
                            <p className="text-3xl font-bold">07:45</p>
                            <p className="text-gray-400 text-sm">BDG (Bandung)</p>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-3 gap-3 text-center text-sm py-4 border-y border-gray-700 mb-4">
                        <div>
                            <p className="text-gray-400">Date</p>
                            <p className="font-semibold">
                                {ticket.date }
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400">
                                {ticket.transportType || 'Transport'}
                            </p>
                            <p className="font-semibold">
                                {ticket.transportName || 'Sangkuriang'}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400">Seat</p>
                            <p className="font-semibold">
                                {ticket.ticketQuantity || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="text-center bg-gray-900 rounded-2xl p-1 mb-4 text-sm">
                        <button className="py-2 rounded-xl font-medium">Perks</button>
                    </div>

                    {/* Passenger List */}
                    <div className="space-y-3 mb-6">
                        <div className="p-3 rounded-xl flex justify-between items-center bg-gray-900">
                            <div>
                                {ticket.perks && Array.isArray(ticket.perks) ? (
                                    ticket.perks.map((perk, index) => (
                                        <div key={index} className="font-medium mt-3">
                                            {perk}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-400">No perks available</div>
                                )}
                            </div>
                            <p className=" text-xl font-semibold">{ticket.price} tk</p>
                        </div>
                    </div>

                    {/* Button */}
                    <button className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                        Book Now
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}