import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useGetAccountsQuery } from "@/services/accountApi";
import {
  UseFormSetValue,
  FieldValues,
  Path,
  UseFormGetValues,
  PathValue,
} from "react-hook-form";

const onChange = (value: string) => {
  console.log(`selected ${value}`);
};

const onSearch = (value: string) => {
  console.log("search:", value);
};

// Filter `option.label` match the user type `input`
const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

type Props<T extends FieldValues> = {
  setValue: UseFormSetValue<T>;
  item: Path<T>;
  getValue: UseFormGetValues<T>;
};
const SelectSearch = <T extends FieldValues>({
  setValue,
  item,
  getValue,
}: Props<T>) => {
  const { isLoading, data } = useGetAccountsQuery();
  const [selectOptions, setSelectOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  useEffect(() => {
    if (data) {
      const res: {
        value: string;
        label: string;
      }[] = data.map((item) => ({ value: String(item.id), label: item.email }));
      setSelectOptions(res);
    }
  }, [data]);
  return (
    <Select
      defaultValue={getValue(item) ? String(getValue(item)) : null}
      showSearch
      placeholder="Select a account"
      optionFilterProp="children"
      onChange={(value) => {
        setValue(item, value as PathValue<T, Path<T>>);
      }}
      onSearch={onSearch}
      filterOption={filterOption}
      options={selectOptions}
    />
  );
};

export default SelectSearch;
