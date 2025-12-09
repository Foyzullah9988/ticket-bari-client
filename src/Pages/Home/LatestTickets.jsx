import React from 'react';
import TicketCard from './TicketCard';


const LatestTickets = ({ ticket }) => {
   
    return (
        <div>
            <TicketCard ticket={ticket} />
        </div>
    );
};

export default LatestTickets;