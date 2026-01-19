import React from "react";
import "./style.css";

const reasons = [
  {
    icon: "💯",
    title: "100% Authentic",
    desc: "All products are directly imported from trusted distributors.",
  },
  {
    icon: "⚡",
    title: "Fast Delivery",
    desc: "Nationwide shipping system ensures speed and safety.",
  },
  {
    icon: "🤝",
    title: "Dedicated Service",
    desc: "Our knowledgeable staff are always ready to assist customers.",
  },
  {
    icon: "🏋️",
    title: "Wide Product Range",
    desc: "We offer a full selection of equipment for tennis, gym, football, badminton, and more.",
  },
];


const WhyChooseUs = () => {
  return (
    <section className="why_choose_us">
      <div className="container">
        <h2>Why Choose Us?</h2>
        <div className="reasons_grid">
          {reasons.map((item, index) => (
            <div key={index} className="reason_card">
              <div className="icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
