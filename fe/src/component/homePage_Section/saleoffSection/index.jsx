import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";

const saleoffItems = [
  {
    title: "Badminton Rackets",
    link: `/${ROUTERS.USER.PRODUCTS}/rackets`,
    img: "/saleProduct/rackets.jpg",
    alt: "Badminton Rackets",
  },
  {
    title: "Badminton Shoes",
    link: `/${ROUTERS.USER.PRODUCTS}/shoes`,
    img: "/saleProduct/shoes.jpg",
    alt: "Badminton Shoes",
  },
  {
    title: "Badminton Shirts",
    link: `/${ROUTERS.USER.PRODUCTS}/shirts`,
    img: "/saleProduct/shirt.jpg",
    alt: "Badminton Shirts",
  },
  {
    title: "Badminton Bags",
    link: `/${ROUTERS.USER.PRODUCTS}/bags`,
    img: "/saleProduct/bag.jpg",
    alt: "Badminton Bags",
  },
];

const SaleoffSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                <Link to="/thanh-ly" className="hover:text-blue-600 transition-colors">
                    Sale Off
                </Link>
            </h2>
            <div className="w-16 h-1 bg-red-500 mx-auto mt-2 rounded-full"></div>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
          }}
          className="pb-10"
        >
          {saleoffItems.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="relative group overflow-hidden rounded-xl bg-gray-100 aspect-[3/1] md:aspect-[4/1.5]">
                <Link to={item.link} title={item.title} className="block w-full h-full">
                  <img
                    src={item.img}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <span className="text-white text-xl font-bold uppercase tracking-wide drop-shadow-md group-hover:translate-x-2 transition-transform duration-300">
                        {item.title}
                    </span>
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
