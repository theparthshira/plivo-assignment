import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ProtectedRoute } from "../components/auth";
import Landing from "./pages/landing";
import NotFoundRoute from "./pages/not-found";
import SelectOrganisation from "./pages/select-organisation";
import CreateOrganisation from "./pages/create-organisation";
import Dashboard from "./pages/dashboard";
import ClientHome from "./pages/client-home";
import ClientRequest from "./pages/client-request";
import Incident from "./pages/incident";

const createAppRouter = () =>
  createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Landing />
        </ProtectedRoute>
      ),
    },
    {
      path: "/404",
      element: <NotFoundRoute />,
    },
    {
      path: "/select-organisation",
      element: (
        <ProtectedRoute>
          <SelectOrganisation />
        </ProtectedRoute>
      ),
    },
    {
      path: "/create-organisation",
      element: (
        <ProtectedRoute>
          <CreateOrganisation />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/client/home",
      element: <ClientHome />,
    },
    {
      path: "/client/request",
      element: <ClientRequest />,
    },
    {
      path: "/incident",
      element: <Incident />,
    },
    {
      path: "*",
      element: <NotFoundRoute />,
    },
  ]);

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(), []);

  return <RouterProvider router={router} />;
};
