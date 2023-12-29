import React from "react";
import { useAppSelector } from "@/hooks";

const usecheckRole = () => {
  const user = useAppSelector((state) => state.user.user);
  return {
    user: user,
    role: user?.role,
  };
};

export default usecheckRole;
