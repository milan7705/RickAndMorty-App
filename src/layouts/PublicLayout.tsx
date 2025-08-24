import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="container-h">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
