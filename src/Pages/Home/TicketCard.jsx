import React from "react";
import { Link } from "react-router";

export default function TicketCard({ lastedTickets }) {

   
    console.log(lastedTickets);
    return (
        <div className="flex flex-col h-full">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 w-full gap-5">
                {
                    lastedTickets.map((ticket, i) => <div key={i} className="w-full bg-black/80 text-white rounded-3xl p-6 shadow-2xl border border-gray-800 flex flex-col h-full">
                        {/* Header */}
                        <div>
                            <figure>
                                <img src={ticket.image} className="h-32 border w-full rounded-2xl" alt="" />
                            </figure>
                        </div>
                        <div className="flex flex-col items-center mb-6">
                            <p className="text-lg font-semibold mt-3">{ticket.title}</p>
                            
                        </div>

                        {/* Time Section */}
                        <div className="flex justify-between items-center mb-6">
                            {/* <div>
                                <p className="text-3xl font-bold">07:15</p>
                                <p className="text-gray-400 text-sm">JKT (Jakarta)</p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-300">🚄</p>
                                <p className="text-gray-500 text-sm">30 Minutes</p>
                            </div> */}
                            <div>
                                {ticket.price} tk
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-3 gap-3 text-center text-sm py-4 border-y border-gray-700 mb-4">
                            {/* <div>
                                <p className="text-gray-400">Date</p>
                                <p className="font-semibold">{ticket.date}</p>
                            </div> */}
                            <div>
                                <p className="text-gray-400">{ticket.transportType}</p>
                                
                            </div>
                            <div>
                                <p className="text-gray-400">Seat</p>
                                <p className="font-semibold">{ticket.ticketQuantity}</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className=" rounded-2xl p-1 mb-4 text-sm bg-gray-900">
                            <p className="text-center py-2 rounded-xl font-medium">Perks</p>
                        </div>

                        {/* Perks Section - This will take available space */}
                        <div className="flex-1">
                            <h2></h2>
                            <ul>
                                {ticket.perks.map((perk, index) => (
                                    <li key={index}>{perk}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Button - This will always stay at bottom */}
                        <div className="mt-auto pt-4">
                            <Link to={`/ticket-details/${ticket._id}`} className="w-full btn bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                                See details
                            </Link>
                        </div>
                    </div>)
                }
            </div>

        </div>
    );
}