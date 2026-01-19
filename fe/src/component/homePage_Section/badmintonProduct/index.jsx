import { memo } from "react";
import { Link } from "react-router-dom";
import "./style.css";

import { ROUTERS } from "../../../utils/router";

const BadmintonSection = () => {
  const products = [
    {
      href: `/${ROUTERS.USER.PRODUCTS}/rackets`,
      img: "/badmintonProduct/rackets.jpg",
      title: "Badminton Rackets",
    },
    {
      href: `/${ROUTERS.USER.PRODUCTS}/shoes`,
      img: "/badmintonProduct/shoes.jpg",
      title: "Badminton Shoes",
    },
    {
      href: `/${ROUTERS.USER.PRODUCTS}/shirts`,
      img: "/badmintonProduct/shirt.jpg",
      title: "Badminton shirts",
    },
    {
      href: `/${ROUTERS.USER.PRODUCTS}/bags`,
      img: "/badmintonProduct/balo.jpg",
      title: "Badminton Backpacks",
    },
  ];

  return (
    <section className="section_badminton py-5">
      <div className="container">
        <div className="title_modules mb-4 text-center">
          <h2>
            <span>Badminton Products</span>
          </h2>
        </div>

        <div className="row g-4">
          {products.map((item, idx) => (
            <div className="col-6 col-md-3" key={idx}>
              <Link to={item.href} className="badminton-card">
                <div className="image-wrap">
                  <img src={item.img} alt={item.title} />
                </div>
                <p className="title">{item.title}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(BadmintonSection);
