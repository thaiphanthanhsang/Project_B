import { memo } from "react";
import MissionVision from "../../../component/profilePage_Section/missionVision";
import ShopProfile from "../../../component/profilePage_Section/shopProfile";
import WhyChooseUs from "../../../component/profilePage_Section/whyChooseUS";
const ProfilePage = () => {
  return (
    <div>
      <ShopProfile />
      <MissionVision />
      <WhyChooseUs />
    </div>
  );
};
export default memo(ProfilePage);
