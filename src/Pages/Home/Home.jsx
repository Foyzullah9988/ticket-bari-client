import React from 'react';
import Hero from './Hero';
import TicketCard from './TicketCard';
import LatestTickets from './LatestTickets';
import { Link } from 'react-router';

const Home = () => {

    return (
        <div>
            home
            <Hero />
            <LatestTickets />


            <div className="flex justify-center items-center my-5">
                <Link to={'/all-tickets'} className="btn btn-outline bg-black/10">
                    See All
                </Link>
            </div>
        </div>
    );
};

export default Home;