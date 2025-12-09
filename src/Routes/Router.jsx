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

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <Error />,
        hydrateFallbackElement:<Loading/>,
        children: [
            {
                path: "",
                hydrateFallbackElement:<Loading/>,
                element: <Home />
                
            },
            {
                path:'all-tickets',
                element:<PrivateRoute>
                    <AllTickets/>
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
        path:'/ticket-details/:id',
        element:<PrivateRoute>
            <TicketDetails/>
        </PrivateRoute>
    }
])