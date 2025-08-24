import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const PrivateLayout = () => {
  return (
    <>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default PrivateLayout;
