import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaDollarSign, FaTicketAlt, FaChartBar, FaCalendarAlt, FaShoppingCart } from 'react-icons/fa';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from '../../../Components/Shared/Loading';

const Revenue = () => {
    const axiosSecure = useAxiosSecure();
    const user = JSON.parse(localStorage.getItem('user')) || {};

    // Fetch revenue data
    const { data: revenueData = [], isLoading: revenueLoading } = useQuery({
        queryKey: ['revenue', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/bookings/revenue/status?vendorEmail=${user.email}`);
            return res.data;
        }
    });
    console.log(revenueData);

    // Fetch vendor's tickets data
    const { data: ticketsData = [], isLoading: ticketsLoading } = useQuery({
        queryKey: ['tickets', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tickets`);
            return res.data;
        }
    });
    // console.log(ticketsData);

    // Fetch booking requests data
    const { data: bookingsData = [], isLoading: bookingsLoading } = useQuery({
        queryKey: ['bookings', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/bookings`);
            return res.data;
        }
    });
    // console.log(bookingsData);

    // Calculate statistics
    const calculateStats = () => {
        const paidBookings = bookingsData.filter(booking => booking.status === 'paid');
        const pendingBookings = bookingsData.filter(booking => booking.status === 'pending');
        const acceptedBookings = bookingsData.filter(booking => booking.status === 'accepted');
        const rejectedBookings = bookingsData.filter(booking => booking.status === 'rejected');

        const totalRevenue = revenueData[0]?.totalRevenue || 0;
        console.log(totalRevenue);
        const totalTicketsSold = revenueData[0]?.totalTicketSold || 0;
        const totalBookings = paidBookings.length + acceptedBookings.length + pendingBookings.length + rejectedBookings.length;
        const totalTicketsAdded = ticketsData.length;

        const approvedTickets = ticketsData.filter(ticket => ticket.verificationStatus === 'approved').length;
        const pendingTickets = ticketsData.filter(ticket => ticket.verificationStatus === 'pending').length;
        const rejectedTickets = ticketsData.filter(ticket => ticket.verificationStatus === 'rejected').length;

        // Revenue by transport type
        const revenueByTransport = {};
        paidBookings.forEach(booking => {
            const transportType = booking.transportType || 'Unknown';
            revenueByTransport[transportType] = (revenueByTransport[transportType] || 0) + booking.totalPrice;
        });

        // Prepare chart data
        const transportChartData = Object.keys(revenueByTransport).map(transport => ({
            name: transport,
            value: revenueByTransport[transport]
        }));

        const ticketStatusData = [
            { name: 'Approved', value: approvedTickets },
            { name: 'Pending', value: pendingTickets },
            { name: 'Rejected', value: rejectedTickets }
        ];

        const bookingStatusData = [
            { name: 'Paid', value: paidBookings.length },
            { name: 'Accepted', value: acceptedBookings.length },
            { name: 'Pending', value: pendingBookings.length },
            { name: 'Rejected', value: rejectedBookings.length }
        ];

        // Monthly revenue (if we have date data)
        const monthlyRevenue = {};
        paidBookings.forEach(booking => {
            if (booking.bookingDate) {
                const month = new Date(booking.bookingDate).toLocaleString('default', { month: 'short' });
                monthlyRevenue[month] = (monthlyRevenue[month] || 0) + booking.totalPrice;
            }
        });

        const monthlyChartData = Object.keys(monthlyRevenue).map(month => ({
            month,
            revenue: monthlyRevenue[month]
        })).sort((a, b) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months.indexOf(a.month) - months.indexOf(b.month);
        });

        return {
            totalRevenue,
            totalTicketsSold,
            totalBookings,
            totalTicketsAdded,
            approvedTickets,
            pendingTickets,
            rejectedTickets,
            paidBookings: paidBookings.length,
            pendingBookings: pendingBookings.length,
            acceptedBookings: acceptedBookings.length,
            rejectedBookings: rejectedBookings.length,
            transportChartData,
            ticketStatusData,
            bookingStatusData,
            monthlyChartData
        };
    };

    const stats = calculateStats();

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
    const TICKET_COLORS = ['#00C49F', '#FFBB28', '#FF8042'];
    const BOOKING_COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042'];

    if (revenueLoading || ticketsLoading || bookingsLoading) {
        return <Loading />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-linear-to-r from-primary/10 to-secondary/10 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary text-primary-content rounded-xl">
                        <FaChartBar className="text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Revenue Overview</h1>
                        <p className="text-gray-600">Track your sales, tickets, and performance</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="card bg-linear-to-r from-blue-500 to-blue-600 dark:from-blue-950 dark:to-blue-900 text-white shadow-lg">
                    <div className="card-body p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                                <div className="text-sm opacity-90 mt-1">Total Revenue</div>
                            </div>
                            <FaDollarSign className="text-3xl opacity-70" />
                        </div>
                        <div className="mt-2 text-xs opacity-75">
                            From {stats.paidBookings} paid bookings
                        </div>
                    </div>
                </div>

                <div className="card bg-linear-to-r from-green-500 to-green-600 dark:from-green-950 dark:to-green-900 text-white shadow-lg">
                    <div className="card-body p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold">{stats.totalTicketsSold}</div>
                                <div className="text-sm opacity-90 mt-1">Tickets Sold</div>
                            </div>
                            <FaTicketAlt className="text-3xl opacity-70" />
                        </div>
                        <div className="mt-2 text-xs opacity-75">
                            Across {stats.paidBookings} transactions
                        </div>
                    </div>
                </div>

                <div className="card bg-linear-to-r from-purple-500 to-purple-600 dark:from-purple-950 dark:to-purple-900 text-white shadow-lg">
                    <div className="card-body p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold">{stats.totalBookings}</div>
                                <div className="text-sm opacity-90 mt-1">Total Bookings</div>
                            </div>
                            <FaShoppingCart className="text-3xl opacity-70" />
                        </div>
                        <div className="mt-2 text-xs opacity-75">
                            {stats.paidBookings} paid, {stats.pendingBookings} pending
                        </div>
                    </div>
                </div>

                <div className="card bg-linear-to-r from-amber-500 to-amber-600 dark:from-amber-950 dark:to-amber-900 text-white shadow-lg">
                    <div className="card-body p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold">{stats.totalTicketsAdded}</div>
                                <div className="text-sm opacity-90 mt-1">Tickets Added</div>
                            </div>
                            <FaCalendarAlt className="text-3xl opacity-70" />
                        </div>
                        <div className="mt-2 text-xs opacity-75">
                            {stats.approvedTickets} approved, {stats.pendingTickets} pending
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue by Transport Type */}
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title text-lg font-semibold">Revenue by Transport Type</h2>
                        <div className="h-64 md:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.transportChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                                        labelFormatter={(label) => `Transport: ${label}`}
                                    />
                                    <Legend />
                                    <Bar dataKey="value" name="Revenue" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Distribution of revenue across different transport types
                        </p>
                    </div>
                </div>

                {/* Ticket Status Distribution */}
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title text-lg font-semibold">Ticket Status Distribution</h2>
                        <div className="h-64 md:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.ticketStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(entry) => `${entry.name}: ${entry.value}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {stats.ticketStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={TICKET_COLORS[index % TICKET_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [value, 'Tickets']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 mt-2">
                            {stats.ticketStatusData.map((item, index) => (
                                <div key={index} className="flex items-center gap-1">
                                    <div 
                                        className="w-3 h-3 rounded-full" 
                                        style={{ backgroundColor: TICKET_COLORS[index] }}
                                    ></div>
                                    <span className="text-xs">{item.name}: {item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Booking Status Distribution */}
                <div className="card bg-base-100 shadow lg:col-span-2">
                    <div className="card-body">
                        <h2 className="card-title text-lg font-semibold">Booking Status Overview</h2>
                        <div className="h-64 md:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.bookingStatusData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" name="Number of Bookings">
                                        {stats.bookingStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={BOOKING_COLORS[index % BOOKING_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {stats.bookingStatusData.map((item, index) => (
                                <div key={index} className="stat">
                                    <div className="stat-title">{item.name}</div>
                                    <div className="stat-value text-lg">{item.value}</div>
                                    <div className="stat-desc">
                                        {item.value > 0 
                                            ? `${((item.value / stats.totalBookings) * 100).toFixed(1)}% of total`
                                            : 'No bookings'
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monthly Revenue Trend */}
                {stats.monthlyChartData.length > 0 && (
                    <div className="card bg-base-100 shadow lg:col-span-2">
                        <div className="card-body">
                            <h2 className="card-title text-lg font-semibold">Monthly Revenue Trend</h2>
                            <div className="h-64 md:h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.monthlyChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip 
                                            formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                                            labelFormatter={(label) => `Month: ${label}`}
                                        />
                                        <Legend />
                                        <Bar dataKey="revenue" name="Revenue" fill="#00C49F" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Revenue distribution across months
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Summary Table */}
            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <h2 className="card-title text-lg font-semibold">Performance Summary</h2>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr className="bg-base-200">
                                    <th>Metric</th>
                                    <th>Value</th>
                                    <th>Percentage</th>
                                    <th>Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Conversion Rate</td>
                                    <td>
                                        {stats.totalBookings > 0 
                                            ? `${((stats.paidBookings / stats.totalBookings) * 100).toFixed(1)}%`
                                            : '0%'
                                        }
                                    </td>
                                    <td>
                                        {stats.totalBookings > 0 
                                            ? `${((stats.paidBookings / stats.totalBookings) * 100).toFixed(1)}%`
                                            : '0%'
                                        }
                                    </td>
                                    <td>
                                        <div className="badge badge-success">
                                            {stats.totalBookings > 0 
                                                ? ((stats.paidBookings / stats.totalBookings) * 100).toFixed(1) >= 50 
                                                    ? 'Good' 
                                                    : 'Needs Improvement'
                                                : 'No Data'
                                            }
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Average Ticket Price</td>
                                    <td>
                                        {stats.totalTicketsSold > 0 
                                            ? `$${(stats.totalRevenue / stats.totalTicketsSold).toFixed(2)}`
                                            : '$0.00'
                                        }
                                    </td>
                                    <td>Per Ticket</td>
                                    <td>
                                        <div className="badge badge-info">Standard</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Approval Rate</td>
                                    <td>
                                        {stats.totalTicketsAdded > 0 
                                            ? `${((stats.approvedTickets / stats.totalTicketsAdded) * 100).toFixed(1)}%`
                                            : '0%'
                                        }
                                    </td>
                                    <td>
                                        {stats.totalTicketsAdded > 0 
                                            ? `${((stats.approvedTickets / stats.totalTicketsAdded) * 100).toFixed(1)}%`
                                            : '0%'
                                        }
                                    </td>
                                    <td>
                                        <div className="badge badge-warning">
                                            {stats.totalTicketsAdded > 0 
                                                ? ((stats.approvedTickets / stats.totalTicketsAdded) * 100).toFixed(1) >= 80 
                                                    ? 'High' 
                                                    : 'Low'
                                                : 'No Data'
                                            }
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Revenue per Booking</td>
                                    <td>
                                        {stats.paidBookings > 0 
                                            ? `$${(stats.totalRevenue / stats.paidBookings).toFixed(2)}`
                                            : '$0.00'
                                        }
                                    </td>
                                    <td>Average</td>
                                    <td>
                                        <div className="badge badge-success">Healthy</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Tips Section */}
            <div className="card bg-info/10 border border-info/20">
                <div className="card-body">
                    <h2 className="card-title text-info">
                        <FaChartBar />
                        Revenue Optimization Tips
                    </h2>
                    <div className="space-y-2">
                        <p className="text-sm">
                            <span className="font-bold">1. Increase Approval Rate:</span> Ensure your tickets have clear descriptions and good quality images.
                        </p>
                        <p className="text-sm">
                            <span className="font-bold">2. Boost Conversion:</span> Respond quickly to booking requests to prevent customers from choosing alternatives.
                        </p>
                        <p className="text-sm">
                            <span className="font-bold">3. Seasonal Pricing:</span> Adjust prices during peak seasons to maximize revenue.
                        </p>
                        <p className="text-sm">
                            <span className="font-bold">4. Regular Updates:</span> Keep ticket quantities and prices up to date to avoid rejected bookings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Revenue;