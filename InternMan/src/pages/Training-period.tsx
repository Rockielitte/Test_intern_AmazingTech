import {
  useAddAccountMutation,
  useEditAccountMutation,
  useGetAccountsQuery,
} from "@/services/accountApi";
import { format } from "date-fns";
import { Account, GenderEnum, Period, PeriodStatusEnum } from "@/types";
import {
  Badge,
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
import { useAddPeriodMutation, useGetPeriodsQuery } from "@/services/periodApi";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import PeriodEdit from "@/components/PeriodEdit";
import { useEffect, useState } from "react";
import usecheckRole from "@/hooks/usecheckRole";
const { RangePicker } = DatePicker;
type Props = {};
const regexNotSpaceFirst = /^(?:[^ ]|$)/;
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const phoneRegex = /^0\d{8,10}$/;
const formSchema = z.object({
  // code: z.string().regex(regexPattern),
  accountId: z.coerce.number().min(1, "Required"),
  period: z.any().array().length(2, "Required"),
  status: z.nativeEnum(PeriodStatusEnum),
});

const defaultValue = {
  accountId: 0,
  period: [],
  status: PeriodStatusEnum.In_progress,
};
const dateFormat = "MM/DD/YYYY";
export type formSchemaType = z.infer<typeof formSchema>;
const columns: ColumnsType<Period> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (_, { account: { first_name, last_name } }) => {
      return (
        <Typography.Text strong>{`${first_name} ${last_name}`}</Typography.Text>
      );
    },
  },

  {
    title: "Email",
    key: "email",
    render: (_, { account: { email } }) => {
      return <Typography.Text>{email}</Typography.Text>;
    },
    width: 250,
  },
  {
    title: "Phone",

    key: "phone",
    render: (_, { account: { phone } }) => {
      return <Typography.Text>{phone}</Typography.Text>;
    },
  },
  {
    title: "Position",

    key: "position",
    render: (_, { account: { position } }) => {
      return (
        <Tag color="success" style={{}}>
          {position}
        </Tag>
      );
    },
  },
  {
    title: "Period",
    key: "period",
    render: (_, { startedDate, endDate }) => {
      return (
        <RangePicker
          value={[dayjs(startedDate, dateFormat), dayjs(endDate, dateFormat)]}
          format={dateFormat}
        />
      );
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (value) => {
      return value == PeriodStatusEnum.Done ? (
        <Tag
          color="green-inverse"
          style={{
            minWidth: 78,
          }}
        >
          {value}
        </Tag>
      ) : value == PeriodStatusEnum.Rejected ? (
        <Tag
          color={"red-inverse"}
          style={{
            minWidth: 78,
          }}
        >
          {value}
        </Tag>
      ) : (
        <Tag
          color={"blue-inverse"}
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
    title: "Action",

    key: "action",
    render: (_, record) => (
      <PeriodEdit key={record.id} record={record}></PeriodEdit>
    ),
  },
];

const TrainingPeriod = (props: Props) => {
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValue,
  });
  const { data, error, isLoading } = useGetPeriodsQuery();

  const token = theme.useToken();
  const [dataSource, setDataSource] = useState(data);
  useEffect(() => {
    setDataSource(data);
  }, [data]);
  const [value, setValue] = useState("");
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
          title="Create training period"
          formMutation={useAddPeriodMutation}
          fields={["accountId", "period"]}
          payLoad={{
            id: 0,
            method: "Period",
          }}
        ></ModalCustom>
      )}

      <div
        style={{
          maxWidth: "50%",
        }}
      >
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search name"
          value={value}
          onChange={(e) => {
            const currValue = e.target.value;
            setValue(currValue);
            if (!currValue.length) {
              setDataSource(data);
              return;
            }
            const filteredData = data?.filter((entry) => {
              const test =
                entry.account.first_name + " " + entry.account.last_name;
              return test.includes(value);
            });
            console.log(filteredData);

            setDataSource(filteredData);
          }}
          // style={{
          //   maxWidth: "50%",
          // }}
        />
      </div>
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

export default TrainingPeriod;
