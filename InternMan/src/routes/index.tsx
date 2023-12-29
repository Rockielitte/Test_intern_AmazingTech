import MainLayout from "@/layouts/MainLayout";

import { createBrowserRouter } from "react-router-dom";
import Loadable from "./Loadable";
import Login from "@/pages/Login";
import Error from "@/pages/Error";
import AuthGuard from "./AuthGuard";
const Accounts = Loadable({ loader: () => import("../pages/Accounts") });
const Tasks = Loadable({ loader: () => import("../pages/Tasks") });
const Period = Loadable({ loader: () => import("../pages/Training-period") });
const Dashboard = Loadable({ loader: () => import("../pages/DashBoard") });
export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/",
    element: <AuthGuard></AuthGuard>,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: Dashboard,
          },
          {
            path: "tasks",
            element: Tasks,
          },
          {
            path: "accounts",
            element: Accounts,
          },
          {
            path: "training-period",
            element: Period,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Error></Error>,
  },
]);
