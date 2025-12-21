import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import Error from "../Components/Shared/Error";
import PublicRoute from "./PublicRoute";
import AllTickets from "../Pages/AllTickets";
import PrivateRoute from "./PrivateRoute";
import Loading from "../Components/Shared/Loading";
import TicketDetails from "../Pages/TicketDetails";
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";
import AddTickets from "../Pages/Dashboard/VendorDashboard/AddTickets";
import Profile from "../Pages/Dashboard/Profile";
import MyTickets from "../Pages/Dashboard/VendorDashboard/MyTickets";
import ManageTickets from "../Pages/Dashboard/AdminDashboard/ManageTickets";
import ManageUsers from "../Pages/Dashboard/AdminDashboard/ManageUsers";
import Advertise from "../Pages/Dashboard/AdminDashboard/Advertise";
import MyBooking from "../Pages/Dashboard/UserDashboard.jsx/MyBooking";
import BookingsRequest from "../Pages/Dashboard/VendorDashboard/BookingsRequest";
import Payment from "../Pages/Dashboard/UserDashboard.jsx/Payment";
import PaymentCancel from "../Pages/Dashboard/UserDashboard.jsx/PaymentCancel";
import PaymentSuccess from "../Pages/Dashboard/UserDashboard.jsx/PaymentSuccess";
import Revenue from "../Pages/Dashboard/VendorDashboard/Revenue";
import TransactionHistory from "../Pages/Dashboard/UserDashboard.jsx/TransactionHistory";
import VendorRoute from "./VendorRoute";
import AdminRoute from "./AdminRoute";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <Error />,
        hydrateFallbackElement: <Loading />,
        children: [
            {
                path: "",
                element: <Home />

            },
            {
                path: 'all-tickets',
                element: <PrivateRoute>
                    <AllTickets />
                </PrivateRoute>
            }
        ]
    },
    {
        path: '/auth',
        element: <PublicRoute>
            <AuthLayout />
        </PublicRoute>,
        children: [
            {
                path: '/auth/login',
                element: <Login />
            },
            {
                path: '/auth/register',
                element: <Register />
            },
        ]
    },
    {
        path: '/ticket-details/:id',
        element: <PrivateRoute>
            <TicketDetails />
        </PrivateRoute>
    },
    {
        path: '/dashboard',
        element: <PrivateRoute>
            <DashboardLayout />
        </PrivateRoute>,
        hydrateFallbackElement: <Loading />,
        children: [
            {
                path: "",
                element: <DashboardHome />
            },
            {
                path: '/dashboard/profile',
                element: <Profile />
            },
            {
                path: '/dashboard/add-tickets',
                element: <VendorRoute>
                    <AddTickets />
                </VendorRoute>
            },
            {
                path: '/dashboard/my-tickets',
                element: <VendorRoute>
                    <MyTickets />
                </VendorRoute>
            },
            {
                path: '/dashboard/revenue',
                element: <VendorRoute>
                    <Revenue />
                </VendorRoute>
            },
            {
                path: '/dashboard/bookings',
                element: <VendorRoute>
                    <BookingsRequest />
                </VendorRoute>
            },
            {
                path: '/dashboard/manage-tickets',
                element: <AdminRoute>
                    <ManageTickets />
                </AdminRoute>
            },
            {
                path: '/dashboard/manage-users',
                element: <AdminRoute>
                    <ManageUsers />
                </AdminRoute>
            },
            {
                path: '/dashboard/advertise',
                element: <AdminRoute>
                    <Advertise />
                </AdminRoute>
            },
            {
                path: '/dashboard/my-bookings',
                element: <MyBooking />
            },
            {
                path: '/dashboard/transactions',
                element: <TransactionHistory />
            },
            {
                path: '/dashboard/payment/:ticketId',
                element: <Payment />
            },
            {
                path: '/dashboard/payment-success',
                element: <PaymentSuccess />
            },
            {
                path: '/dashboard/payment-cancelled',
                element: <PaymentCancel />
            },
        ]
    },
])