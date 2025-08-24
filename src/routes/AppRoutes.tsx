import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";

import Login from "../auth/Login";
import Signup from "../auth/Register";

import Characters from "../pages/Characters";
import CharacterDetail from "../pages/CharacterDetail";
import LocationDetail from "../pages/LocationDetail";
import EpisodeDetail from "../pages/EpisodesDetail";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <PrivateLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/characters" element={<Characters />} />
        <Route path="/characters/:id" element={<CharacterDetail />} />
        <Route path="/location/:id" element={<LocationDetail />} />
        <Route path="/episode/:id" element={<EpisodeDetail />} />
      </Route>
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  );
};

export default AppRoutes;
