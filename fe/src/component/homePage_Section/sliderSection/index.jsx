import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./style.css";

import { Link } from "react-router-dom";

import { ROUTERS } from "../../../utils/router";

import astrox99 from "/src/assets/users/images/slider/yonex-astrox-99.jpg";
import graht from "/src/assets/users/images/slider/grpht-thrttl.jpg";
import va from "/src/assets/users/images/slider/victor-axelsen.jpg";
import nanoflare from "/src/assets/users/images/slider/1000z.jpg";
import ynx_eclp from "/src/assets/users/images/slider/ynx_eclp_banner.jpg";

const slides = [
  {
    href: `/${ROUTERS.USER.PRODUCTS}/rackets/yonex`,
    title: "99 gen 3",
    src: astrox99,
  },
  {
    href: `/${ROUTERS.USER.PRODUCTS}`,
    title: "Graht thrttl",
    src: graht,
  },
  {
    href: `/${ROUTERS.USER.PRODUCTS}/rackets/yonex`,
    title: "VA",
    src: va,
  },
  {
    href: `/${ROUTERS.USER.PRODUCTS}/rackets/yonex`,
    title: "nanoflare 1000",
    src: nanoflare,
  },
  {
    href: `/${ROUTERS.USER.PRODUCTS}/shoes/yonex`,
    title: "ynx-eclp",
    src: ynx_eclp,
  },
];

const SliderSection = () => {
  return (
    <div className="section_slider">
      <Swiper
        loop={true}
        navigation={true}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <Link to={slide.href} title={slide.title}>
              <img src={slide.src} alt={slide.title} className="slider-image" />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default memo(SliderSection);