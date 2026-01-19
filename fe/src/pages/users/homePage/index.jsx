import { memo } from "react";
import BadmintonProduct from "../../../component/homePage_Section/badmintonProduct";
import PickleballSection from "../../../component/homePage_Section/pickleballSection";
import TennisSection from "../../../component/homePage_Section/tennisSection";
import SaleoffSection from "../../../component/homePage_Section/saleoffSection";
import NewProductSection from "../../../component/homePage_Section/newproductSection";
import ServiceSection from "../../../component/homePage_Section/servicesSection";
import SliderSection from "../../../component/homePage_Section/sliderSection";

const HomePage = () => {
  return (
    <div>
      <SliderSection />
      <ServiceSection />
      <NewProductSection />
      <SaleoffSection />
      <BadmintonProduct />
      <PickleballSection />
      <TennisSection />
    </div>
  );
};
export default memo(HomePage);
