import { memo } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { ROUTERS } from "../../../../utils/router";
import smashfaster from "/src/assets/users/images/ulikeit/smashfaster.jpg";

const PaymentPage = () => {
  return (
    <div className="payment-page">
      <div className="content-area">
        {/* ======= CỘT TRÁI: HƯỚNG DẪN THANH TOÁN ======= */}
        <article className="article-main">
          <h1 className="article-title">Payment Instructions</h1>
          <div className="posts">
            <div className="time-post">🕒 31-12-2024 09:11</div>
            <div className="time-post">✍ SQBSports</div>
          </div>

          <div className="rte">
            <p>
              <em>
                This article was compiled by <Link to="/">ShopSQB</Link> — one
                of the leading badminton retail systems in Vietnam.
              </em>
            </p>

            <h2>1. Direct payment at our stores</h2>
            <p>
              You can visit any SQB store to make your purchase and payment. The
              following payment methods are accepted:
            </p>
            <ul>
              <li>💵 Cash</li>
              <li>🏧 Bank transfer</li>
              <li>💳 ATM / Visa / MasterCard</li>
            </ul>

            <h2>2. Payment for online purchases</h2>
            <p>
              When ordering online at ShopSQB, you can choose one of the
              following payment methods:
            </p>
            <ul>
              <li>COD – Pay upon delivery.</li>
              <li>Bank transfer before delivery.</li>
            </ul>

            <div className="payment-info">
              <strong>Bank account information:</strong>
              <p>Vietcombank - Phu Tho Branch, Ho Chi Minh City</p>
              <p>
                Account number: <b>111122223333444</b>
              </p>
              <p>
                Account name: <b>SQB badminton</b>
              </p>
            </div>

            <h2>3. SQB Store Branches</h2>

            <div className="ten_khu_vuc">
              📍 Ho Chi Minh City & Binh Duong Area
            </div>
            <ul className="cn_list">
              <li>
                <h4>1. SQB Super Center</h4>
                <p>
                  <b>Address:</b> 81 Nam Ky Khoi Nghia Street, Ward, Binh Duong,
                  Ho Chi Minh City, Vietnam
                </p>
                <p>
                  <b>Hotline:</b>{" "}
                  <a href="tel:0388888888" className="phone">
                    038 888 8888
                  </a>
                </p>
                <p>
                  <b>Payment info:</b> Vietcombank - A/C 111122223333444 - A/C
                  Name: SQB badminton
                </p>
              </li>

              <li>
                <h4>2. SQB SUPER PREMIUM</h4>
                <p>
                  <b>Address:</b> Nam Ky Khoi Nghia Street, Dinh Hoa Ward, Thu
                  Dau Mot City, Binh Duong, Vietnam
                </p>
                <p>
                  <b>Hotline:</b>{" "}
                  <a href="tel:0389999999" className="phone">
                    038 999 9999
                  </a>
                </p>
                <p>
                  <b>Payment info:</b> Techcombank - A/C 111122223333444 - A/C
                  Name: Nguyen Van B
                </p>
              </li>
            </ul>
          </div>
        </article>

        {/* ======= CỘT PHẢI: SIDEBAR ======= */}
        <aside className="sidebar">
          {/* Danh mục tin tức */}
          <nav className="nav-category">
            <h3>News Categories</h3>
            <Link to="/news/khuyen-mai" className="nav-link">
              🏷 Promotions
            </Link>
            <Link to={`/${ROUTERS.USER.NEWS}`} className="nav-link">
              🏸 Badminton News
            </Link>
            <Link to="/news/meo-tap-luyen" className="nav-link">
              💡 Training Tips
            </Link>
            <Link to={`/${ROUTERS.USER.PRODUCTS}`} className="nav-link">
              🛍 New Products
            </Link>
          </nav>

          {/* Bạn có thể thích */}
          <div className="blog_content">
            <h3>You May Also Like</h3>

            <div className="item">
              <img src="/badmintonProduct/rackets.jpg" alt="news 1" />
              <div>
                <h4>
                  <Link to="/news/cach-chon-vot-cau-long">
                    How to Choose a Badminton Racket for Beginners
                  </Link>
                </h4>
                <div className="time-post">🕒 29-09-2025</div>
              </div>
            </div>

            <div className="item">
              <img src="/badmintonProduct/shoes.jpg" alt="news 2" />
              <div>
                <h4>
                  <Link to="/news/top-giay-cau-long-2024">
                    Top Best-Selling Badminton Shoes 2024
                  </Link>
                </h4>
                <div className="time-post">🕒 10-09-2025</div>
              </div>
            </div>

            <div className="item">
              <img src={smashfaster} alt="news 3" />
              <div>
                <h4>
                  <Link to="/news/5-meo-smash-manh-hon">
                    5 Simple Tips to Smash Harder
                  </Link>
                </h4>
                <div className="time-post">🕒 02-08-2025</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};


export default memo(PaymentPage);
