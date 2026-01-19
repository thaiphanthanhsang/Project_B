import React from "react";
import "./style.css";

const ShopProfile = () => {
  return (
    <section className="shop_profile">
      <div className="container profile_wrapper">
        <div className="profile_image">
          <div className="image_wrap">
            <img
              src="/shopProfile/Sport Shop.jpg"
              alt="Sport Shop"
              loading="lazy"
            />
            <div className="image_overlay"></div>
          </div>
        </div>

        <div className="profile_content">
          <h2>
            <span>🏆 SQB Badminton</span>
            <br />
            Official Sports Equipment
          </h2>
          <p>
            We offer <strong>premium sports equipment</strong> from
            international brands. With the mission to{" "}
            <em>inspire the spirit of sports</em>, we provide a modern shopping
            experience and dedicated customer service.
          </p>
          <ul>
            <li> 100% authentic products</li>
            <li> Professional consultation service</li>
            <li> Fast nationwide delivery</li>
            <li> Wide range of sports products</li>
          </ul>
          <a href="#products" className="btn_shop">
            Explore now →
          </a>
        </div>
      </div>
    </section>
  );
};


export default ShopProfile;
