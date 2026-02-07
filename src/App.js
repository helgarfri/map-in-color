// src/components/App.js
import "./components/App.css";

import { useContext, useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";

import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import EditMap from "./components/EditMap";
import YourMaps from "./components/YourMaps";
import DataIntegration from "./components/DataIntergration";
import ProfileSettings from "./components/ProfileSettings";
import ProfilePage from "./components/ProfilePage";
import StarredMaps from "./components/StarredMaps";
import NotificationList from "./components/NotificationList";
import ChangePassword from "./components/ChangePassword";
import DeleteAccount from "./components/DeleteAccount";
import Docs from "./components/Docs";
import AdminPanel from "./components/AdminPanel";
import BannedUser from "./components/BannedUser";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Terms from "./components/Terms";
import VerifyAccount from "./components/VerifyAccount";
import Verified from "./components/Verified";
import VerificationError from "./components/VerificationError";
import PublicExplore from "./components/PublicExplore";
import LoggedInExplore from "./components/LoggedInExplore";
import PublicMapDetail from "./components/PublicMapDetail";
import LoggedInMapDetail from "./components/LoggedInMapDetail";
import Map from "./components/Map";
import Explore from "./components/Explore";
import ResetPasswordPage from "./components/ResetPassword";
import PrivateRoute from "./components/PrivateRoute";
import { UserContext } from "./context/UserContext";

function ScrollToTopWrapper() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return <Outlet />;
}

export default function App() {
  const { authToken, profile } = useContext(UserContext);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const isUserLoggedIn = !!authToken && !!profile;

  const router = createBrowserRouter([
    {
      element: <ScrollToTopWrapper />,
      children: [
        { path: "/", element: <Home /> },

        { path: "/docs", element: <Docs /> },

        {
          path: "/create",
          element: (
            <PrivateRoute>
              <DataIntegration
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            </PrivateRoute>
          ),
        },

        {
          path: "/dashboard",
          element: (
            <PrivateRoute>
              <Dashboard
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            </PrivateRoute>
          ),
        },

        {
          path: "/map/:id",
          element: isUserLoggedIn ? <LoggedInMapDetail /> : <PublicMapDetail />,
        },

        {
          path: "/explore",
          element: isUserLoggedIn ? (
            <LoggedInExplore
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          ) : (
            <PublicExplore />
          ),
        },

        {
          path: "/your-maps",
          element: (
            <PrivateRoute>
              <YourMaps
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            </PrivateRoute>
          ),
        },

        {
          path: "/starred-maps",
          element: (
            <StarredMaps
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          ),
        },

        { path: "/login", element: <Login /> },
        { path: "/signup", element: <Signup /> },

        {
          path: "/edit/:mapId",
          element: (
            <EditMap
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          ),
        },

        {
          path: "/profile/:username",
          element: (
            <ProfilePage
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          ),
        },

        {
          path: "/settings",
          element: (
            <ProfileSettings
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          ),
        },

        {
          path: "/change-password",
          element: (
            <ChangePassword
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          ),
        },

        { path: "/delete-account", element: <DeleteAccount /> },

        {
          path: "/notifications",
          element: (
            <PrivateRoute>
              <NotificationList
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            </PrivateRoute>
          ),
        },

        { path: "/adminPanel", element: <AdminPanel /> },
        { path: "/banned", element: <BannedUser /> },
        { path: "/privacy", element: <PrivacyPolicy /> },
        { path: "/terms", element: <Terms /> },
        { path: "/verify-account", element: <VerifyAccount /> },
        { path: "/verified", element: <Verified /> },
        { path: "/verification-error", element: <VerificationError /> },

        { path: "/map", element: <Map /> },

        // (if you still use Explore somewhere else)
        { path: "/explore-old", element: <Explore /> },
        { path: "/reset-password", element: <ResetPasswordPage /> },

      ],
      
    },
  ]);

  return <RouterProvider router={router} />;
}
