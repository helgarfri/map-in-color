// src/App.js (or src/components/App.js depending on your project)
import "./components/App.css";
import React from "react";
import { useContext, useEffect } from "react";
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
import { SidebarContext } from "./context/SidebarContext";

/* Scroll to top on route change */
function ScrollToTopWrapper() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return <Outlet />;
}

function SidebarAutoCloseOnRouteChange() {
  const { pathname } = useLocation();
  const { setIsCollapsed } = useContext(SidebarContext);
  const prevPathRef = React.useRef(pathname);

  useEffect(() => {
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    const isMobile = window.innerWidth < 1000;
    if (isMobile) setIsCollapsed(true);
  }, [pathname, setIsCollapsed]);

  return <Outlet />;
}

export default function App() {
  const { authToken, profile } = useContext(UserContext);
  const isUserLoggedIn = !!authToken && !!profile;

  const router = createBrowserRouter([
    {
      element: <SidebarAutoCloseOnRouteChange />,
      children: [
        {
          element: <ScrollToTopWrapper />,
          children: [
            { path: "/", element: <Home /> },
            { path: "/docs", element: <Docs /> },

            {
              path: "/create",
              element: (
                <PrivateRoute>
                  <DataIntegration />
                </PrivateRoute>
              ),
            },

            {
              path: "/dashboard",
              element: (
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              ),
            },

            {
              path: "/map/:id",
              element: isUserLoggedIn ? <LoggedInMapDetail /> : <PublicMapDetail />,
            },

            {
              path: "/explore",
              element: isUserLoggedIn ? <LoggedInExplore /> : <PublicExplore />,
            },

            {
              path: "/your-maps",
              element: (
                <PrivateRoute>
                  <YourMaps />
                </PrivateRoute>
              ),
            },

            {
              path: "/starred-maps",
              element: (
                <PrivateRoute>
                  <StarredMaps />
                </PrivateRoute>
              ),
            },

            { path: "/login", element: <Login /> },
            { path: "/signup", element: <Signup /> },

            {
              path: "/edit/:mapId",
              element: (
                <PrivateRoute>
                  <EditMap />
                </PrivateRoute>
              ),
            },

            {
              path: "/profile/:username",
              element: (
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              ),
            },

            {
              path: "/settings",
              element: (
                <PrivateRoute>
                  <ProfileSettings />
                </PrivateRoute>
              ),
            },

            {
              path: "/change-password",
              element: (
                <PrivateRoute>
                  <ChangePassword />
                </PrivateRoute>
              ),
            },

            {
              path: "/delete-account",
              element: (
                <PrivateRoute>
                  <DeleteAccount />
                </PrivateRoute>
              ),
            },

            {
              path: "/notifications",
              element: (
                <PrivateRoute>
                  <NotificationList />
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

            // legacy
            { path: "/explore-old", element: <Explore /> },
            { path: "/reset-password", element: <ResetPasswordPage /> },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
