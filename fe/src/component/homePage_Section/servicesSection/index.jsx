import React from "react";
import "./style.css";
const services = [
  {
    id: 1,
    img: "https://cdn.shopvnb.com/themes/images/policy_image_2.svg",
    alt: "Vận chuyển toàn quốc",
    text: (
      <>
        <span>NATIONWIDE</span> Shipping <br /> Cash on delivery
      </>
    ),
  },
  {
    id: 2,
    img: "https://cdn.shopvnb.com/themes/images/policy_image_1.svg",
    alt: "Bảo đảm chất lượng",
    text: (
      <>
        <span>Quality assurance</span> <br /> Quality assured products
      </>
    ),
  },
  {
    id: 3,
    img: "https://cdn.shopvnb.com/themes/images/thanh_toan.svg",
    alt: "Thanh toán",
    text: (
      <>
        Make <span>PAYMENTS</span> <br /> With{" "}
        <span>MULTIPLE METHODS</span>
      </>
    ),
  },
  {
    id: 4,
    img: "https://cdn.shopvnb.com/themes/images/doi_san_pham.svg",
    alt: "Đổi sản phẩm mới",
    text: (
      <>
        <span>Exchange for new product</span> <br /> If product is defective
      </>
    ),
  },
];

const ServiceSection = () => {
  return (
    <div className="section_services">
      <div className="container">
        <div className="row promo-box">
          {services.map((service) => (
            <div key={service.id} className="col-lg-3 col-md-3 col-sm-6 col-6">
              <div className="promo-item">
                <div className="icon">
                  <img
                    width="50"
                    height="50"
                    src={service.img}
                    alt={service.alt}
                  />
                </div>
                <div className="info">{service.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceSection;
