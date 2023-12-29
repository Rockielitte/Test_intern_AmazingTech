import { useGetAccountsQuery } from "@/services/accountApi";
import { Assignment } from "@/types";
import { Space, Tag, Tooltip } from "antd";
import React, { useMemo } from "react";
import _ from "lodash";
import Item from "antd/es/list/Item";
type Props = {
  assignments: Assignment[];
};

const AccountsTag = ({ assignments }: Props) => {
  const { data } = useGetAccountsQuery();

  const accounts = useMemo(() => {
    if (assignments.length && !data) {
      return [];
    } else {
      const res = _.filter(data, (item) => {
        const index = _.findIndex(assignments, (ass) => {
          return ass.accountId === item.id;
        });
        return index >= 0;
      });
      return res;
    }
  }, [assignments, data]);

  return (
    <Space wrap>
      {accounts?.map((item) => (
        <Tooltip title={item.email} color={"geekblue"} key={item.id}>
          <Tag color={"volcano"}>{item.first_name}</Tag>
        </Tooltip>
      ))}
    </Space>
  );
};

export default AccountsTag;
