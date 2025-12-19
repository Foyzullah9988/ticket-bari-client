import React from 'react';
import { Link } from 'react-router';

const PaymentCancel = () => {
    return (
        <div>
            <h3 className="text-4xl">Payment canceled</h3>
        <Link to={'/dashboard/my-bookings'} className='btn btn-secondary'>Try again</Link>
        </div>
    );
};

export default PaymentCancel;