import React from "react";
import { useMemo } from "react";
import {
  UserOutlined,
  SolutionOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";

const useSider = () => {
  const siderList = useMemo(() => {
    return [
      {
        label: "Account",
        icon: <UserOutlined />,
        href: "accounts",
      },
      {
        label: "Tasks",
        icon: <SolutionOutlined />,
        href: "tasks",
      },
      {
        label: "Training period",
        icon: <FieldTimeOutlined />,
        href: "training-period",
      },
    ];
  }, []);
  return siderList;
};

export default useSider;
