import React from "react";
import "./style.css";

const MissionVision = () => {
  return (
    <section className="mission_vision">
      <div className="container">
        <h2>Vision & Mission</h2>
        <div className="mv_grid">
          <div className="mv_card">
            <h3>🌍 Vision</h3>
            <p>
              To become the <strong>leading sports retail chain</strong> in
              Vietnam, where customers can always find high-quality products and
              dedicated service.
            </p>
          </div>
          <div className="mv_card">
            <h3>🔥 Mission</h3>
            <p>
              To inspire the spirit of sports and improve community health by
              providing <em>reliable, authentic, and high-value</em> products.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
