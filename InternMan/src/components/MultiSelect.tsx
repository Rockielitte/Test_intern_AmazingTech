import React, { useMemo } from "react";
import { Select, Space } from "antd";
import type { SelectProps } from "antd";
import { useGetAccountsQuery } from "@/services/accountApi";
import {
  UseFormSetValue,
  FieldValues,
  Path,
  UseFormGetValues,
  PathValue,
} from "react-hook-form";
const options: SelectProps["options"] = [];

const handleChange = (value: number[]) => {
  console.log(`selected ${value}`);
};

type Props<T extends FieldValues> = {
  setValue: UseFormSetValue<T>;
  item: Path<T>;
  getValue: UseFormGetValues<T>;
};
const MutiSelect = <T extends FieldValues>({
  setValue,
  item,
  getValue,
}: Props<T>) => {
  const { data } = useGetAccountsQuery();
  const accounts = useMemo<{ value: number; label: string }[]>(() => {
    if (!data) {
      return [];
    } else {
      const res: { value: number; label: string }[] = data.map((item) => ({
        value: item.id,
        label: item.email,
      }));
      return res;
    }
  }, [data]);
  return (
    <Space style={{ width: "100%" }} direction="vertical">
      <Select
        mode="multiple"
        allowClear
        style={{ width: "100%" }}
        placeholder="Please select"
        defaultValue={getValue(item)}
        onChange={(value) => {
          setValue(item, value as PathValue<T, Path<T>>);
        }}
        options={accounts}
      />
    </Space>
  );
};

export default MutiSelect;
