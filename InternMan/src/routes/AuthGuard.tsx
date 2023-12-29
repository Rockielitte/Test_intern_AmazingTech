import { useAppSelector } from "@/hooks";
import { type FC, type ReactNode } from "react";

import {
  Navigate,
  Outlet,
  useLocation,
  useRouteLoaderData,
} from "react-router-dom";

interface AuthGuardProps {
  children?: ReactNode;
  allowedRoles?: string[];
}
const AuthGuard: FC<AuthGuardProps> = ({ allowedRoles, children }) => {
  const user = useAppSelector((state) => state.user.user);
  console.log("Authen");

  return user ? <Outlet /> || { children } : <Navigate to="/login" replace />;
};

export default AuthGuard;
