import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { FaArrowRight, FaBus, FaTrain, FaPlane, FaShip } from 'react-icons/fa';
import { Link } from 'react-router';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const Hero = () => {
    const slides = [
        {
            id: 1,
            title: "Travel Across Bangladesh",
            subtitle: "Book Bus, Train, Launch & Flight Tickets",
            description: "Experience seamless travel booking with our all-in-one platform. Find the best routes and prices across Bangladesh.",
            bgImage: "https://images.unsplash.com/photo-1610560875826-af5b05a96cfa?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            buttonText: "Explore Tickets",
            icon: FaBus,
            color: "from-blue-600 to-cyan-500"
        },
        {
            id: 2,
            title: "Best Train Journey",
            subtitle: "Experience Luxury Travel",
            description: "Book comfortable train tickets with AC, sleeper, and first-class options. Travel in style across Bangladesh.",
            bgImage: "https://images.unsplash.com/photo-1535535112387-56ffe8db21ff?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            buttonText: "Book Train",
            icon: FaTrain,
            color: "from-emerald-600 to-green-500"
        },
        {
            id: 3,
            title: "Fly Across the Country",
            subtitle: "Domestic Flights Available",
            description: "Quick and convenient domestic flights to all major cities. Book your flight tickets with special discounts.",
            bgImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
            buttonText: "Find Flights",
            icon: FaPlane,
            color: "from-purple-600 to-pink-500"
        },
        {
            id: 4,
            title: "River Journeys by Launch",
            subtitle: "Scenic Waterway Travel",
            description: "Experience the beauty of Bangladesh's rivers. Book comfortable launch tickets for your next river journey.",
            bgImage: "https://images.unsplash.com/photo-1721273649878-5cf03f0c85db?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            buttonText: "Book Launch",
            icon: FaShip,
            color: "from-indigo-600 to-blue-500"
        },
        {
            id: 5,
            title: "Premium Bus Services",
            subtitle: "AC & Non-AC Options",
            description: "Choose from a wide range of premium bus services with comfortable seating and modern amenities.",
            bgImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
            buttonText: "Book Bus",
            icon: FaBus,
            color: "from-orange-600 to-amber-500"
        }
    ];

    return (
        <div className="relative w-full h-[75vh] md:h-[80vh] overflow-hidden rounded-3xl mt-4">
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={true}

                navigation={true}
                loop={true}
                speed={1000}
                className="h-full"
            >
                {slides.map((slide) => {
                    const Icon = slide.icon;
                    return (
                        <SwiperSlide key={slide.id}>
                            <div className="relative h-full w-full">
                                {/* Background Image with Overlay */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                    style={{ backgroundImage: `url('${slide.bgImage}')` }}
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/30"></div>
                                    <div className={`absolute inset-0 bg-linear-to-r ${slide.color} mix-blend-overlay opacity-30`}></div>
                                </div>

                                {/* Content */}
                                <div className="relative h-full flex items-center">
                                    <div className="container mx-auto px-4 md:px-8">
                                        <div className="max-w-3xl">
                                            {/* Icon */}
                                            <div className="mb-6">
                                                <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                                    <Icon className="text-lg md:text-3xl text-white" />
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h1 className="text-xl md:text-4xl lg:text-7xl font-semibold md:font-bold text-white md:mb-4 leading-tight">
                                                {slide.title.split(' ').map((word, i) => (
                                                    <span key={i} className="inline-block mr-2">
                                                        {word}
                                                    </span>
                                                ))}
                                            </h1>

                                            {/* Subtitle */}
                                            <h2 className=" lg:text-xl text-white/90 mb-6 font-semibold">
                                                {slide.subtitle}
                                            </h2>

                                            {/* Description */}
                                            <p className=" md:text-lg text-white/80 mb-8 max-w-2xl leading-relaxed">
                                                {slide.description}
                                            </p>

                                            {/* CTA Button */}
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <Link
                                                    to="/all-tickets"
                                                    className="inline-flex items-center justify-center gap-3 px-2 bg-linear-to-r from-white to-gray-100 text-gray-900 md:px-8 md:py-1 rounded-2xl font-bold text-lg hover:from-gray-100 hover:to-white transform hover:-translate-y-1 transition-all duration-300 shadow-2xl shadow-white/20"
                                                >
                                                    {slide.buttonText}
                                                    <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                                                </Link>

                                                <Link
                                                    to="/dashboard"
                                                    className="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white/30 px-2 text-white md:px-8 md:py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
                                                >
                                                    Become a Vendor
                                                </Link>
                                            </div>

                                            {/* Stats */}
                                            <div className="md:mt-12 mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                                <div className="bg-white/10 backdrop-blur-sm rounded-xl md:p-4 border border-white/20">
                                                    <div className="md:text-3xl md:font-bold text-white">5000+</div>
                                                    <div className="text-white/70 text-sm">Tickets Booked</div>
                                                </div>
                                                <div className="bg-white/10 backdrop-blur-sm rounded-xl md:p-4 border border-white/20">
                                                    <div className="md:text-3xl md:font-bold text-white">150+</div>
                                                    <div className="text-white/70 text-sm">Active Routes</div>
                                                </div>
                                                <div className="bg-white/10 backdrop-blur-sm rounded-xl md:p-4 border border-white/20">
                                                    <div className="md:text-3xl md:font-bold text-white">98%</div>
                                                    <div className="text-white/70 text-sm">Customer Satisfaction</div>
                                                </div>
                                                <div className="bg-white/10 backdrop-blur-sm rounded-xl md:p-4 border border-white/20">
                                                    <div className="md:text-3xl md:font-bold text-white">24/7</div>
                                                    <div className="text-white/70 text-sm">Support Available</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Transport Type Indicator */}
                                <div className="absolute bottom-8 right-8 hidden lg:block">
                                    <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                                        <Icon className="text-2xl text-white" />
                                        <span className="text-white font-medium capitalize">
                                            {slide.icon === FaBus && "Bus Service"}
                                            {slide.icon === FaTrain && "Train Service"}
                                            {slide.icon === FaPlane && "Flight Service"}
                                            {slide.icon === FaShip && "Launch Service"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {/* Search Form Overlay */}
            {/* <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/40 to-transparent ">
                <div className="container mx-auto px-4 pb-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
                            <h3 className="text-white text-xl font-bold mb-6">Find Your Perfect Journey</h3>
                            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">From</label>
                                    <select className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500">
                                        <option value="">Select Origin</option>
                                        <option value="dhaka">Dhaka</option>
                                        <option value="chittagong">Chittagong</option>
                                        <option value="sylhet">Sylhet</option>
                                        <option value="rajshahi">Rajshahi</option>
                                        <option value="khulna">Khulna</option>
                                        <option value="barisal">Barisal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">To</label>
                                    <select className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500">
                                        <option value="">Select Destination</option>
                                        <option value="dhaka">Dhaka</option>
                                        <option value="chittagong">Chittagong</option>
                                        <option value="sylhet">Sylhet</option>
                                        <option value="rajshahi">Rajshahi</option>
                                        <option value="khulna">Khulna</option>
                                        <option value="barisal">Barisal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Transport Type</label>
                                    <select className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500">
                                        <option value="">All Types</option>
                                        <option value="bus">Bus</option>
                                        <option value="train">Train</option>
                                        <option value="plane">Plane</option>
                                        <option value="launch">Launch</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 lg:col-span-4 flex justify-center mt-4">
                                    <button
                                        type="submit"
                                        className="bg-linear-to-r from-emerald-500 to-green-500 text-white px-12 py-3 rounded-xl font-bold hover:from-emerald-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105"
                                    >
                                        Search Tickets
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Custom CSS for Swiper */}
            <style jsx>{`
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #10b981;
          transform: scale(1.2);
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: #10b981;
          background: rgba(0, 0, 0, 0.5);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          backdrop-filter: blur(10px);
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(16, 185, 129, 0.2);
        }
      `}</style>
        </div>
    );
}

export default Hero;