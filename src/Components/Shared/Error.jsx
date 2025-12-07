import Lottie from "lottie-react";
import forbiddenAnimation from "./error.json";
import { Link } from "react-router";


const Error = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            <Lottie animationData={forbiddenAnimation} loop={true} />
            <h1 className="text-3xl font-bold text-red-500">
                The page isn't found.
            </h1>
            <div className="my-3 space-x-3">
                <Link to="/" className="btn btn-primary text-black">
                    {" "}
                    Go to Home
                </Link>
                <Link className="btn btn-secondary" to="/dashboard">
                    {" "}
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default Error ;