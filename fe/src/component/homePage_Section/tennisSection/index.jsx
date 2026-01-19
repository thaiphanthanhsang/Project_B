import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./style.css";

import { Link } from "react-router-dom";

import { ROUTERS } from "../../../utils/router";

const newsList = [
  {
    id: 1,
    title: "Review of Trung Son Pickleball Court in Binh Chanh District, Ho Chi Minh City",
    link: `/${ROUTERS.USER.NEWS}/review-trung-son-pickleball-court`,
    img: "/newsImages/san-pickleball-trung-son.jpg",
    time: "27-09-2025 15:07",
    desc: "Located in Binh Chanh District, Ho Chi Minh City, Trung Son Pickleball Court is highly rated by many players...",
  },
  {
    id: 2,
    title: "Mastering Pickleball Footwork: How to Move Efficiently and Control the Court",
    link: `/${ROUTERS.USER.NEWS}/pickleball-footwork-tips`,
    img: "/newsImages/cach-di-chuyen-trong-pickleball.jpg",
    time: "27-09-2025 14:20",
    desc: "Smart movement is the key to dominating the pickleball court. Whether in singles or doubles, proper footwork helps you...",
  },
  {
    id: 3,
    title: "DUPR Pickleball: Overview and Guide to How the DUPR Rating System Works",
    link: `/${ROUTERS.USER.NEWS}/dupr-pickleball`,
    img: "/newsImages/dupr-pickleball.jpg",
    time: "27-09-2025 11:03",
    desc: "DUPR Pickleball is currently the most popular and dynamic rating system used widely in the pickleball community...",
  },
  {
    id: 4,
    title: "Singles vs Doubles Pickleball: A Detailed Comparison Between the Two Formats",
    link: `/${ROUTERS.USER.NEWS}/singles-vs-doubles-pickleball`,
    img: "/newsImages/so-sanh-pickleball-don-va-doi.jpg",
    time: "27-09-2025 09:42",
    desc: "Pickleball can be played in singles or doubles, but there are many differences in rules, strategies, and playing style...",
  },
  {
    id: 5,
    title: "How to Hold a Pickleball Paddle: Simple and Effective Techniques for Beginners",
    link: `/${ROUTERS.USER.NEWS}/how-to-hold-pickleball-paddle`,
    img: "/newsImages/cach-cam-vot-pickleball.jpg",
    time: "27-09-2025 08:06",
    desc: "To play pickleball effectively, learning the correct way to hold the paddle is crucial—especially for beginners...",
  },
  {
    id: 6,
    title: "Pickleball Paddle 14mm vs 16mm: In-Depth Comparison of the Key Differences",
    link: `/${ROUTERS.USER.NEWS}/pickleball-paddle-14mm-vs-16mm`,
    img: "/newsImages/so-sanh-vot-pickleball-14mm-va-16mm.jpg",
    time: "26-09-2025 16:10",
    desc: "When choosing a pickleball paddle, the thickness of the paddle face greatly affects your playing style and control...",
  },
];


const News = () => {
  return (
    <section className="section_blog">
      <div className="container">
        <div className="title_modules">
          <h2>
            <Link to={`/${ROUTERS.USER.NEWS}`} title="Tin tức mới">
              <span>News</span>
            </Link>
          </h2>
        </div>

        <div className="block-blog">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            grabCursor={true}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="blog-swiper"
          >
            {newsList.map((news) => (
              <SwiperSlide key={news.id}>
                <div className="item-blog">
                  <div className="block-thumb">
                    <Link className="thumb" to={news.link} title={news.title}>
                      <img
                        src={news.img}
                        alt={news.title}
                        width="400"
                        height="240"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                  <div className="block-content">
                    <h3>
                      <Link to={news.link} title={news.title}>
                        {news.title}
                      </Link>
                    </h3>
                    <p className="time-post">
                      <span>{news.time}</span>
                    </p>
                    <p className="justify">{news.desc}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default memo(News);
