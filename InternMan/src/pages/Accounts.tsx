import {
  useAddAccountMutation,
  useEditAccountMutation,
  useGetAccountsQuery,
} from "@/services/accountApi";
import { Account, GenderEnum } from "@/types";
import {
  Button,
  Dropdown,
  FloatButton,
  Form,
  Input,
  MenuProps,
  Space,
  Tag,
  Tooltip,
  Typography,
  theme,
  Badge,
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import {
  WomanOutlined,
  ManOutlined,
  ControlOutlined,
  PlusOutlined,
  SearchOutlined,
  DownOutlined,
} from "@ant-design/icons";
import ModalCustom from "@/components/ModalForm";
import useToken from "antd/es/theme/useToken";
import Search from "antd/es/input/Search";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import EditWrapper from "@/components/EditWrapper";
import AccountEdit from "@/components/AccountEdit";
import { useEffect, useState } from "react";
import usecheckRole from "@/hooks/usecheckRole";

type Props = {};
const regexNotSpaceFirst = /^(?:[^ ]|$)/;
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const phoneRegex = /^0\d{8,10}$/;
const formSchema = z.object({
  // code: z.string().regex(regexPattern),

  first_name: z
    .string()
    .min(1, "This field is required")
    .regex(regexNotSpaceFirst, "First character is not a space"),
  last_name: z
    .string()
    .min(1, "This field is required")
    .regex(regexNotSpaceFirst, "First character is not a space"),
  email: z
    .string()
    .min(1, "This field is required")
    .regex(regexNotSpaceFirst, "First character is not a space")
    .regex(emailRegex, "Email is in invaild format"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(regexNotSpaceFirst, "First character is not a space")
    .regex(phoneRegex, "Phone is in invalid Vietnamese format"),
  gender: z.nativeEnum(GenderEnum),

  position: z
    .string()
    .min(1, "This field is required")
    .regex(regexNotSpaceFirst, "First character is not a space"),
});
const defaultValue: Omit<Account, "id"> = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  gender: "" as GenderEnum,
  position: "",
};
export type formSchemaType = z.infer<typeof formSchema>;
const columns: ColumnsType<Account> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (_, { first_name, last_name }) => {
      return (
        <Typography.Text strong>{`${first_name} ${last_name}`}</Typography.Text>
      );
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 250,
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
    render: (value) => {
      return value == GenderEnum.MALE ? (
        <Tag
          color="blue-inverse"
          icon={<ManOutlined />}
          style={{
            minWidth: 78,
          }}
        >
          {value}
        </Tag>
      ) : (
        <Tag
          color={"pink-inverse"}
          icon={<WomanOutlined />}
          style={{
            minWidth: 78,
          }}
        >
          {value}
        </Tag>
      );
    },
  },
  {
    title: "Position",
    dataIndex: "position",
    key: "position",
    render: (value) => {
      return (
        <Tag color="success" style={{}}>
          {value}
        </Tag>
      );
    },
  },
  {
    title: "Action",

    key: "action",
    render: (_, record) => (
      <AccountEdit key={record.id} record={record}></AccountEdit>
    ),
  },
];
const items = [
  {
    label: "Edit",
    key: 1,
  },

  {
    label: "Delete",
    key: "2",
    danger: true,
  },
];

const Accounts = (props: Props) => {
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValue,
  });
  const { data, error, isLoading } = useGetAccountsQuery();

  const token = theme.useToken();
  const [dataSource, setDataSource] = useState(data);
  useEffect(() => {
    setDataSource(data);
  }, [data]);
  const [value, setValue] = useState("");
  const FilterByEmailInput = (
    <Input
      placeholder="Search email"
      value={value}
      onChange={(e) => {
        const currValue = e.target.value;
        setValue(currValue);
        const filteredData = data?.filter((entry) =>
          entry.email.includes(currValue)
        );
        setDataSource(filteredData);
      }}
      style={{}}
    />
  );
  const { role } = usecheckRole();
  return (
    <div
      style={{
        height: "100%",
        padding: 0,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {role == "admin" && (
        <ModalCustom
          form={form}
          title="Create account"
          formMutation={useAddAccountMutation}
          fields={[
            "first_name",
            "last_name",
            "email",
            "phone",
            "gender",
            "position",
          ]}
        ></ModalCustom>
      )}
      {
        <div
          style={{
            maxWidth: "50%",
          }}
        >
          <Input
            placeholder="Search email"
            value={value}
            onChange={(e) => {
              const currValue = e.target.value;
              setValue(currValue);
              const filteredData = data?.filter((entry) =>
                entry.email.includes(currValue)
              );
              console.log(filteredData);

              setDataSource(filteredData);
            }}
            // style={{
            //   maxWidth: "50%",
            // }}
            prefix={<SearchOutlined />}
          />
        </div>
      }
      <div
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          bordered
          loading={isLoading}
          style={{
            boxShadow: token.token.boxShadowTertiary,
          }}
        />
      </div>
    </div>
  );
};

export default Accounts;
