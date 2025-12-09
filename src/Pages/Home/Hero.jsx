import React from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// Modules
import { Pagination, Autoplay } from 'swiper/modules';

export default function Hero() {
    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
    };

    return (
        <>
            <Swiper
                slidesPerView={'auto'}
                pagination={pagination}
                modules={[Pagination, Autoplay]}
                loop={true}
                autoplay={{
                    delay: 2000,     // 2 sec
                    disableOnInteraction: false,
                }}
                className="mySwiper"
            >
                <SwiperSlide>Slide 1</SwiperSlide>
                <SwiperSlide>Slide 2</SwiperSlide>
                <SwiperSlide>Slide 3</SwiperSlide>
                <SwiperSlide>Slide 4</SwiperSlide>
                <SwiperSlide>Slide 5</SwiperSlide>
                <SwiperSlide>Slide 6</SwiperSlide>
                <SwiperSlide>Slide 7</SwiperSlide>
                <SwiperSlide>Slide 8</SwiperSlide>
                <SwiperSlide>Slide 9</SwiperSlide>
            </Swiper>
        </>
    );
}
