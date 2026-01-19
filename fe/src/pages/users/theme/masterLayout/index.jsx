import { memo } from "react";
import { Outlet } from "react-router-dom";
import Header from "../header";
import Footer from "../footer";

const MasterLayout = ({ ...pros }) => {
  return (
    <div>
      <Header />

      <main className="main-content-area">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default memo(MasterLayout);
