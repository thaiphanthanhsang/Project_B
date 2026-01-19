import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./style.css";

import { Link } from "react-router-dom";

import { ROUTERS } from "../../../utils/router";

const saleoffItems = [
  {
    title: "Badminton Rackets",
    link: `/${ROUTERS.USER.PRODUCTS}/rackets`,
    img: "/saleProduct/rackets.jpg",
    alt: "Vợt Cầu Lông",
  },
  {
    title: "Badminton Shoes",
    link: `/${ROUTERS.USER.PRODUCTS}/shoes`,
    img: "/saleProduct/shoes.jpg",
    alt: "Giày Cầu Lông",
  },
  {
    title: "Badminton Shirts",
    link: `/${ROUTERS.USER.PRODUCTS}/shirts`,
    img: "/saleProduct/shirt.jpg",
    alt: "Áo Cầu Lông",
  },
  {
    title: "Badminton Bags",
    link: `/${ROUTERS.USER.PRODUCTS}/bags`,
    img: "/saleProduct/bag.jpg",
    alt: "Túi Vợt",
  },
];

const SaleoffSection = () => {
  return (
    <section className="section_saleoff">
      <div className="container">
        <div className="title_modules">
          <h2>
            <Link to="/thanh-ly" title="Thanh lý">
              <span>Sale off</span>
            </Link>
          </h2>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="saleoff-swiper"
        >
          {saleoffItems.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="saleoff-card">
                <Link to={item.link} title={item.title}>
                  <img
                    src={item.img}
                    alt={item.alt}
                    width="406"
                    height="136"
                    loading="lazy"
                  />
                  <div className="overlay">
                    <span>{item.title}</span>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SaleoffSection;
