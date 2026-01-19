import { memo } from "react";
import "./style.css";

const branches = [
  {
    id: 1,
    name: "SQB Super Center",
    address: "81 Nam Ky Khoi Nghia, Ward, Binh Duong, Ho Chi Minh City, Vietnam",
    phone: "038 888 8888",
    map: "https://maps.app.goo.gl/dCA2issmb7C1cb8p8",
  },
  {
    id: 2,
    name: "SQB SUPER PREMIUM",
    address: "Nam Ky Khoi Nghia, Dinh Hoa, Thu Dau Mot, Binh Duong, Vietnam",
    phone: "038 999 9999",
    map: "https://maps.app.goo.gl/dCA2issmb7C1cb8p8",
  },
];

const Contact = () => {
  return (
    <div className="layout-contact">
      <div className="container">
        <div className="row">
          {/* Left Column */}
          <div className="col-lg-6 col-12">
            <div className="contact">
              <h4>Need help or have any questions?</h4>
              <div className="des_foo"></div>
              <div className="time_work">
                <div className="item">
                  <b>Hotline:</b>{" "}
                  <a
                    className="fone"
                    href="tel:0388888888"
                    title="038 888 8888 | 038 999 9999"
                  >
                    038 888 8888 | 038 999 9999
                  </a>
                </div>
                <div className="item">
                  <b>Email:</b>{" "}
                  <a
                    href="mailto:info@sqbbadminton.com"
                    title="info@sqbbadminton.com"
                  >
                    info@sqbbadminton.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="form-contact">
              <h4>Contact Us</h4>
              <form
                acceptCharset="UTF-8"
                id="contact"
                method="post"
                className="has-validation-callback"
              >
                <input type="hidden" name="act" value="send" />
                <div className="group_contact">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                      <input
                        type="text"
                        placeholder="Full Name"
                        name="name"
                        className="form-control form-control-lg"
                        required
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                      <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        className="form-control form-control-lg"
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                        required
                      />
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                      <input
                        type="number"
                        placeholder="Phone Number"
                        name="phone"
                        className="form-control form-control-lg"
                        required
                      />
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                      <textarea
                        placeholder="Message"
                        name="message"
                        className="form-control content-area form-control-lg"
                        rows="5"
                        required
                      ></textarea>
                      <button type="submit" className="btn-lienhe">
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-6 col-12">
            <div className="logos text-start mb-3">
              <a href="/" className="logo-wrapper">
                <img
                  src="./logo.png"
                  alt="SQB Badminton"
                  className="img-responsive"
                />
              </a>
            </div>

            <ul className="widget-menu contact-info-page cn_list list-unstyled">
              {branches.map((branch) => (
                <li key={branch.id}>
                  <a
                    href="javascript:;"
                    data-ban_do={branch.map}
                    data-ten={branch.name}
                    data-dia_chi={branch.address}
                    data-so_dt={branch.phone}
                    data-id={branch.id}
                    className="map_lien_he"
                  >
                    <strong>
                      {branch.id}. {branch.name}
                    </strong>
                  </a>{" "}
                  - <i className="fa fa-phone color-x"></i>{" "}
                  <a href={`tel:${branch.phone}`}>{branch.phone}</a>
                  <br />
                  <i className="fa fa-map-marker color-x"></i>{" "}
                  <span>{branch.address}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Contact);
